# MyBank Account Aggregator

Third Party Provider or TPP allows to securely access customer’s accounts in order to provide consolidated account information. It aggregates accounts from different banks owned by the customer to manage and control them from one central place. 

It also provides analytics to help you stay on track with your spending in just one place. MyBank categories every transaction making it easier to see how your spending affects your planned savings.

Security ...

![image](mybank.png)

## Application architecture

The application is divided into frontend and backend. The frontend is written in Vue.js. Backend is implemented using serverless. Each component of the application is defined as a function and exposed as an API. There are also notification which are consumed by specific functions. The information is stored in AWS DynamoDB.

## Instalation 

1. Clone repository
```shell
git clone https://github.com/jmiddleton/mybank-poc.git
git clone https://github.com/jmiddleton/mybank-serverless.git
```
2. Get in the project folder
```shell
cd mybank-poc
```
3. Install dependencies via npm
```shell
npm install
```
4. Repeat the steps for mybank-serverless

## Quick start
First start mybank-serverless application
```shell
cd mybank-serverless
serverless offline start
```

Then run the web application mybank-poc 
```shell
cd mybank-poc
npm run serve
```

