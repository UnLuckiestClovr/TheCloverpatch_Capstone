9/30

https://aws.amazon.com/fargate/getting-started/

Studied up on AWS Containerization so as to be able to properly CLoud Host this application in the end-step, 
will be setting up further appointments with Coach Christian Grey to further understand the process along with learning the AWS Infrastrucutre and proper automation of deployment.


10/4

https://redis.io/docs/latest/operate/oss_and_stack/management/security/

https://fastapi.tiangolo.com/tutorial/cors/#use-corsmiddleware

Researching ways to make my backend services more secure, especially those dealing with Redis as a database.

Main methods are to limit the allowed access to the database itself. This is where we will use the Backend as the security, as it holds the information needed to connect in the first place. 

Will be implementing CORS to deal with this issue and dissallowing anyone random to access the database.


10/7

I have come to the conclusion a mixture of Header values and CORS would be sufficient in this assignment, although for added security I will be using Salt Hashing for passwords and other secure data so as to avoid
possible data leakages causing massive issues. As to how this will be stored it will be stored as two seperate objects in relation to each other. User objects will look as followed:

User: {
    ID: str,
    Username: str,
    Email: str
}

UserPass: {
    ID: str,
    PssHash: str
}