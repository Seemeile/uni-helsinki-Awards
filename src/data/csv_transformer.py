import sys, os, argparse, csv, re
from requests_html import HTMLSession

parser = argparse.ArgumentParser(
    description = 'Converts a data csv to the desired project format', 
    epilog = 'example: python3 the_oscar_award_transform.py "./data.csv"')
parser.add_argument('csv', help = 'the oscar award csv to transform')
parser.add_argument('type', help = 'GoldenGlobe | Emmy | Oscars')
if len(sys.argv) < 3:
    parser.print_help()
    sys.exit(os.EX_OK)
args = parser.parse_args()

if args.type not in ['GoldenGlobe', 'Emmy', 'Oscars']:
    print('unknown type: ' + args.type)
    parser.print_help()
    sys.exit(os.EX_OK)

is_first = True
with open(args.csv, newline='') as input_file:  
    with open(args.csv + '_transformed.csv', 'w', newline='') as output_file:
        writer = csv.writer(output_file)
        reader = csv.reader(input_file)
        for row in reader:
            if is_first:
                writer.writerow(['year', 'category', 'winner', 'name', 'work'])
                is_first = False
            else:
                try:
                    if args.type == 'GoldenGlobe':
                        year = row[1]
                        category = row[3]
                        name = row[4]
                        work = row[5]
                        winner = row[6]
                    elif args.type == 'Emmy':
                        year = row[1]
                        category = row[2]
                        name = row[4]
                        work = row[3]
                        winner = row[7]
                    elif args.type == 'Oscars':
                        year = row[1]
                        category = row[3]
                        name = row[4]
                        work = row[5]
                        winner = row[6]
                    
                    # normalize name
                    names = re.split(',(?!\sThe)|;| and | &', name)
                    for aName in names:
                        aName = re.sub('^"(.*)"$', '', aName)
                        # word filters
                        if aName.strip() == 'n/a':
                            aName = ''
                        if aName.strip() in ['Music', 'SDSA', 'Producer', 'Producers', 'Jr.', 'CSA', 'ASC', 'CAS', 'Camera',
                            'Composer/Lyricist', 'Creator', 'Talent', 'Host', 'Animator', 'Common', 'Co-Host', 'Artist',
                            'Partners', 'Writer', 'Arranger', 'Lyrics', 'Lyricist', 'Applicator', 'Application', 'Conductor',
                            'Music)', 'Designer', 'Series)', 'Makeup', 'Special Effects Makeup', 'Composer']:
                            continue
                        if len(aName.strip()) == 0:
                            continue
                        
                        # in text filters
                        if aName.find(':') != -1:
                            aName = aName[aName.index(':') + 1:]
                        if aName.find(' by ') != -1:
                            aName = aName[aName.index(' by ') + 4:]
                        if aName.find('Costume ') != -1:
                            continue
                        if aName.find('as ') != -1:
                            continue
                        if aName.find(' by') != -1:
                            continue
                        if aName.find(' for ') != -1:
                            continue
                        if aName.find(' Producer') != -1:
                            continue
                        if aName.find(' Director') != -1:
                            continue
                        if aName.find(' Decorator') != -1:
                            continue
                        if aName.find(' Designer') != -1:
                            continue
                        if aName.find(' Photography') != -1:
                            continue
                        if aName.find(' Editor') != -1:
                            continue
                        if aName.find(' Mixer') != -1:
                            continue
                        if aName.find(' Supervisor') != -1:
                            continue
                        if aName.find(' Coordinator') != -1:
                            continue
                        if aName.find(' Artist') != -1:
                            continue
                        if aName.find(' Control') != -1:
                            continue
                        if aName.find(' Hairstylist') != -1:
                            continue
                        if aName.find(' Compositor') != -1:
                            continue
                        if aName.find(' Lead') != -1:
                            continue
                        if aName.find(' Department') != -1:
                            continue
                        if aName.find(' Animator') != -1:
                            continue
                        if aName.find(' Modeler/Animator') != -1:
                            continue
                        if aName.find('Head of ') != -1:
                            continue
                        if aName.find(' Atrist') != -1:
                            continue
                        if aName.find(' Operator') != -1:
                            continue
                        if aName.find('2D ') != -1:
                            continue
                        if aName.find('3D ') != -1:
                            continue
                        if aName.find('Makeup Effects ') != -1:
                            continue
                        
                        # normalize work
                        if work.strip() == 'n/a':
                            work = ''

                        writer.writerow([year, category, winner, aName.strip(), work])
                except:
                    print('error on row:')
                    print(row)
                    sys.exit(-1)
  