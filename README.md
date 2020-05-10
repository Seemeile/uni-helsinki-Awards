This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project Description

This project is part of the Interactive Data Visualization Project 2020 at the University of Helsinki. The goal was to choose any dataset and create visualizations based on these by applying design and visualization principles.

My choice was to display information about different movie/show awards to visualize facts about:
- a comprehensive view on each year. Who was nominated, who won, with what and a few insights about the person and the work behind it
- toplists like the most wins by name in a range of year
- year comparisons like nominee gender distribution or the average age of nominees
- geographical distribution of the nominees to see where the nominees came from

### view

view the project on [https://uni-helsinki-awards.herokuapp.com/](https://uni-helsinki-awards.herokuapp.com/)

### data

In this project, three different data sources were aggregated from www.kaggle.com:
- [https://www.kaggle.com/unanimad/golden-globe-awards](https://www.kaggle.com/unanimad/golden-globe-awards)
- [https://www.kaggle.com/unanimad/the-oscar-award](https://www.kaggle.com/unanimad/the-oscar-award)
- [https://www.kaggle.com/unanimad/emmy-awards](https://www.kaggle.com/unanimad/emmy-awards)

The data was reordered to generate three normalized CSV files (see. XXX). After that the files were enriched by person and movie information from [https://www.themoviedb.org/](https://www.themoviedb.org/) via their API at [https://www.kaggle.com/unanimad/emmy-awards](https://www.kaggle.com/unanimad/emmy-awards) (see. XXX).

### build

1. download the source code
2. run `yarn dev` in its root directory to start the react app
3. open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.
