import pyodbc

from typing import Annotated
from fastapi import Header, HTTPException
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# Database Connection Settings and Engine Creation
DB_USERNAME = "sa"
DB_PASSWORD = "Nc220370979"
DB_SERVER = "localhost:10004"
DB_DATABASE = "EnhancedUsersDB"
SQL_CONN_STRING = f"mssql+pyodbc://{DB_USERNAME}:{DB_PASSWORD}@{DB_SERVER}/{DB_DATABASE}?driver=ODBC+Driver+17+for+SQL+Server"

engine = create_engine(SQL_CONN_STRING)


async def get_token_header(AuthenticationToken: Annotated[str, Header()]):
    try:
        print(AuthenticationToken)
        # Validate the token against the database.
        with engine.connect() as connection:
            result = connection.execute(text("SELECT COUNT(*) FROM EnhancedUsers WHERE ID = :idtoken"), {"idtoken": AuthenticationToken})
            count = result.scalar()

        if count == 0:
            print("[Food Service] Auth Failed")
            raise HTTPException(status_code=400, detail="INVALID ACCESS CLEARANCE : PREPARE TO BE HIT WITH A COGNITOHAZARD")
        
        print("[Food Service] Auth Successful")
    except SQLAlchemyError as e:
        # Handle specific SQLAlchemy exceptions
        print(e)
        if "No such table" in str(e):
            raise HTTPException(status_code=404, detail="Table not found in authorizer.")
        else:
            raise HTTPException(status_code=500, detail="Database error occurred in authorizer.")
    except Exception as e: 
        print(e)
        raise HTTPException(status_code=500, detail="CLEARANCE CHECK ERROR : PLEASE TRY AGAIN")
