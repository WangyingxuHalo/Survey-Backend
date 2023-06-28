
# 问卷管理系统后端

  

项目的live demo在 https://mysurvey.wwwyxxx.uk

  

本仓库为问卷管理系统后端代码的仓库。

剩下的两个仓库在

  

1）SurveyApp: https://github.com/WangyingxuHalo/surveyApp

  

2）Survey-Client: https://github.com/WangyingxuHalo/Survey-Client

  

# API

使用Node.js搭配Koa实现了问卷管理系统所有需要的API:   
### I. survey-related API 

1. GET /api/question  
	retrieve all the surveys of current user    
2. POST /api/question  
	create new survey  
3. GET /api/question/:id  
	retrieve all the components of a single survey sorted by order  
4. PATCH /api/question/:id  
	update survey information  
5. PATCH /api/question/save/:id  
	save survey information  
6. POST /api/question/duplicate/:id  
	duplicate survey  
7. DELETE /api/question  
	delete survey from Trash  

### II. user-related API 
1. POST /api/user/register  
	register  
2. POST /api/user/login  
	login  
3. GET /api/user/info  
	get the user info  

### III. stat-related API 
1. GET /api/stat/:questionId  
	get question list for survey stat page  
2. GET /api/stat/tob/:questionId  
	get question list for survey-client  
3. GET /api/stat/tob/:questionId/:componentId/:selectedComponentType  
	user see survey results  

  ### IV. answer-related API 
4. POST /api/answer
	answer survey







