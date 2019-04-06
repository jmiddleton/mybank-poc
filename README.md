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

## Quick start - development mode
First start mybank-serverless application
```shell
cd mybank-serverless
serverless offline start
```
Once the server has started an api-key will be generated and displayed in the command line:
i.e.: Key with token: d41d8cd98f00b204e9800998ecf812345

Copy that value to .env.development file before starting mybank-poc web application.

To test the application locally use the following commands: 
```shell
cd mybank-poc
npm run serve
```

### Production mode
The easiest way to preview production locally is using a Node.js static file server.

```
serve -s dist -l 8888
```

Please make sure you have configured your environment for production. The file .env.production.local on the root folder should contain the following variables:

- VUE_APP_BASE_URL=http://[YOUR_AWS_LAMBDA_ENDPOINT]:[YOUR_AWS_LAMBDA_PORT]/mybank/v1
- VUE_APP_API_KEY=[YOUR_AWS_LAMBDA_API_KEY]