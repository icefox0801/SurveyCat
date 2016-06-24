# SurveyCat
A tool for launching a survey

## Install
```sh
npm install surveycat -g
```
## Usage

  Usage: surveycat [options]


  Commands:

    init <survey>    init a survey
    config <survey>  config survey questions
    report <survey>  view survey report
    start <survey>   start a survey

  A tool for launching a survey

  Options:

    -h, --help  output usage information
    
## Tutorial
If you want to launch a survey named **mySurvey**, you can launch it following the steps below:
### 1. Initialize the survey
```sh
$ surveycat init mySurvey
13:31:50 INFO  Initializing a survey
? title:  mySurvey
? description:  Please read and answer the questions below carefully
? port:  8016
? type:  paper
? start datetime:  2016-06-24 13:31
? end datetime:  2016-06-25 13:31
13:32:08 INFO  Finish initializing a survey named mySurvey
```
Note that:
1. `port` is on which you start your survey as a node server
2. `type` now support `paper` and `carousel`
3. `start datetime` and `end datetime` can accept date format `YYYY-MM-DD HH:mm`, `YYYY-MM-DD`

### 2. Config the questions of the survey
```sh
$ surveycat config mySurvey
```
After execute the command, a configuration page will be opened in the browser:
![image](https://cloud.githubusercontent.com/assets/3138397/16328924/519f68e6-3a11-11e6-8367-b57e006ebed5.png)
You can config the questions of the survey on this page and then submit them.

### 3. Start the survey
```sh
$ surveycat start mySurvey
```
After execute the command, a survey page will be opened in the browser:
![image](https://cloud.githubusercontent.com/assets/3138397/16329015/3e129ea0-3a12-11e6-8377-641b27deac8e.png)
Then you can share the url with you teammates! If `http://ipaddress` sucks, you can upload the static page to an VPS and modify the submit url manually.

### 4. Checking the survey report
```sh
$ surveycat report mySurvey
```
After execute the command, a survey report page will be opened in the browser:
![image](https://cloud.githubusercontent.com/assets/3138397/16329140/15197478-3a13-11e6-8783-787ba03748a3.png)
