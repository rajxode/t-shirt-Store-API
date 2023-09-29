# t-shirt-Store-API
  This is a complete backend API for an online e-commerce T-shirt store. With User authentication, various Product related operations ( view, purchase, update, add , remove ). Different roles for users ( Admin, Manager and User).
  User with different roles can perform different task and manage data differently.

# Installation:
  Follow these steps to install and run this code on your system.
  - Get the code on your system.
  - Open terminal and navigate to the root directory of code.
  - Inside the terminal run command 'npm install' to install all the project related dependencies.
  - create an .env file in root directory of project.
      Declare following variables in .env file
      - PORT = port on which your localhost will run
      - MONGODB_URL = database url for storing data
        
      - JWT_SECRET_KEY = a secret key for jsonwebtoken
      - JWT_EXPIRY = expiry time for token

      ## Note: Create an account on cloudinary ( in case you don't have one )
      These variables are for uploading images cloudinary  
      - CLOUD_NAME = enter your cloud name
      - CLOUD_API_KEY = api key given by the cloudinary
      - CLOUD_API_SECRET = secret given by the cloudinary
      - CLOUD_FOLDER = folder name for storing user related photos 
      - CLOUD_PRODUCT_FOLDER = folder name for storing product related images

      ## Note: Create an account on MailTrap ( in case you don't have one )
      These variables are related to mailTrap for sending mails to user regarding forget password mail
      - MAIL_SENDER = email address of sender 
      - MAIL_HOST = smtp host link from mailtrap SMTP settings
      - MAIL_PORT = port from mailtrap SMTP settings
      - MAIL_USER = user from mailtrap SMTP settings
      - MAIL_PASS = password from mailtrap SMTP settings

      ## Note: Create an account on Stripe ( in case you don't have one )
      These variables are related to Stripe payment gateway
      - STRIPE_API_KEY = your stripe's publishable key
      - STRIPE_SECRET = your stripe's secret key

      ## Note: Create an account on Razorpay ( in case you don't have one )
      These variables are related to razorpay payment gateway
      - RAZORPAY_API_KEY = your razorpay's public key
      - RAZORPAY_SECRET = your razorpay's secret key
