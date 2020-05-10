import sys, os, argparse, csv, re
from requests_html import HTMLSession

parser = argparse.ArgumentParser(
    description = 'IMDB award person scraper', 
    epilog = 'example: python3 imdb_scraper.py "12345abcdef"')
parser.add_argument('key', help = 'TMDB API key')
parser.add_argument('csv', help = 'csv to process')
if len(sys.argv) < 3:
    parser.print_help()
    sys.exit(os.EX_OK)
args = parser.parse_args()

# open html session
session = HTMLSession()

# load genres
params = { 'api_key': args.key }
genresRequestMovies = session.get('https://api.themoviedb.org/3/genre/movie/list', params=params)
genresRequestShows = session.get('https://api.themoviedb.org/3/genre/tv/list', params=params)
# close genre requests
genresRequestMovies.close()
genresRequestShows.close()
# create genres dictionary
genres = dict()
for entry in genresRequestMovies.json()['genres']:
    genres[entry['id']] = entry['name']
for entry in genresRequestShows.json()['genres']:
    genres[entry['id']] = entry['name']

is_first = True
with open(args.csv, newline='') as input_file:  
    with open(args.csv + '_enriched', 'w', newline='') as output_file:
        writer = csv.writer(output_file)
        reader = csv.reader(input_file)
        for row in reader:
            if is_first:
                row.insert(5, 'p:gender')
                row.insert(6, 'p:birthday')
                row.insert(7, 'p:birthplace')
                row.insert(8, 'p:deathday')
                row.insert(9, 'p:popularity')
                row.insert(10, 'p:biography')
                row.insert(11, 'p:knownForDepartment')
                row.insert(12, 'p:profilePath')
                row.insert(13, 'w:posterPath')
                row.insert(14, 'w:genreIds')
                row.insert(15, 'w:popularity')
                row.insert(16, 'w:overview')
                is_first = False
            else:
                try:
                    # person query
                    params = {
                        'api_key': args.key,
                        'query': row[3],
                    }
                    searchRequest = session.get('https://api.themoviedb.org/3/search/person', params=params)
                    if 'results' not in searchRequest.json():
                        continue
                    searchResults = searchRequest.json()['results']
                    if searchResults and searchResults[0]['name'].lower().replace(' ', '') == row[3].lower().replace(' ', ''):
                        personRequest = session.get('https://api.themoviedb.org/3/person/' \
                            + str(searchResults[0]['id']), params=params)
                        personResult = personRequest.json()
                        # gender
                        if personResult['gender'] == 0:
                            row.insert(5, 'other')
                        elif personResult['gender'] == 1:
                            row.insert(5, 'female')
                        elif personResult['gender'] == 2:
                            row.insert(5, 'male')
                        # birthday
                        if personResult['birthday']:
                            row.insert(6, personResult['birthday'])
                        else:
                            row.insert(6, '')
                        # birthplace
                        if personResult['place_of_birth']:
                            row.insert(7, personResult['place_of_birth'])
                        else:
                            row.insert(7, '')
                        # deathdate
                        if personResult['deathday']:
                            row.insert(8, personResult['deathday'])
                        else:
                            row.insert(8, '')
                        # popularity
                        row.insert(9, personResult['popularity'])
                        # biography
                        row.insert(10, personResult['biography'])
                        # knownForDepartment
                        row.insert(11, personResult['known_for_department'])
                        # profilePath
                        if searchResults[0]['profile_path']:
                            row.insert(12, 'https://image.tmdb.org/t/p/w185' + searchResults[0]['profile_path'])
                        else:
                            row.insert(12, '')
                        # close person request
                        personRequest.close()
                    else:
                        row.insert(5, '')
                        row.insert(6, '')
                        row.insert(7, '')
                        row.insert(8, '')
                        row.insert(9, '')
                        row.insert(10, '')
                        row.insert(11, '')
                        row.insert(12, '')
                    # close search request
                    searchRequest.close()

                    medianame = ''
                    if len(row[4]) == 0:
                        medianame = row[3]
                    else:
                        medianame = row[4]
                    params = {
                        'api_key': args.key,
                        'query': medianame
                    }

                    # movie query
                    searchRequest = session.get('https://api.themoviedb.org/3/search/movie', params=params)
                    searchResults = searchRequest.json()['results']
                    if 'results' not in searchRequest.json():
                        continue
                    # iterate through results
                    for searchResult in searchResults:
                        if searchResult['title'].lower().replace(' ', '') == medianame.lower().replace(' ', ''):
                            # posterpath
                            if searchResult['poster_path']:
                                row.insert(13, 'https://image.tmdb.org/t/p/w185' + searchResult['poster_path'])        
                            else:
                                row.insert(13, '')
                            # genreIds
                            if searchResult['genre_ids']:
                                rowGenres = []
                                for genreId in searchResult['genre_ids']:
                                    if genreId in genres:
                                        rowGenres.append(genres[genreId])
                                row.insert(14, ', '.join(rowGenres))
                            else:
                                row.insert(14, '')
                            # popularity
                            row.insert(15, searchResult['popularity'])
                            # overview
                            row.insert(16, searchResult['overview'])
                            # jump out of for loop
                            break
                    searchRequest.close()

                    # if no movie was found, try tv shows
                    if len(row) < 17:
                        searchRequest = session.get('https://api.themoviedb.org/3/search/tv', params=params)
                        searchResults = searchRequest.json()['results']
                        if 'results' not in searchRequest.json():
                            continue
                        for searchResult in searchResults:
                            if searchResult['name'].lower().replace(' ', '') == medianame.lower().replace(' ', ''):
                                # posterpath
                                if searchResult['poster_path']:
                                    row.insert(13, 'https://image.tmdb.org/t/p/w185' + searchResult['poster_path'])        
                                else:
                                    row.insert(13, '')
                                # genreIds
                                if searchResult['genre_ids']:
                                    rowGenres = []
                                    for genreId in searchResult['genre_ids']:
                                        if genreId in genres:
                                            rowGenres.append(genres[genreId])
                                    row.insert(14, ', '.join(rowGenres))
                                else:
                                    row.insert(14, '')
                                # popularity
                                row.insert(15, searchResult['popularity'])
                                # overview
                                row.insert(16, searchResult['overview'])
                                # jump out of for loop
                                break
                        searchRequest.close()

                    # fill up with empty values if necessary
                    if len(row) < 17:
                        row.insert(13, '')
                        row.insert(14, '')
                        row.insert(15, '')
                        row.insert(16, '')
                except KeyboardInterrupt:
                    print('aborted by user, shutting down..')
                    break
            # write csv row
            writer.writerow(row)
        
# close HTML session
session.close()
