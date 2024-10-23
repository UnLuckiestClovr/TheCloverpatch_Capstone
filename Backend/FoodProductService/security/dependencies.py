import pyodbc

from typing import Annotated
from fastapi import Header, HTTPException
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# Database Connection Settings and Engine Creation
DB_USERNAME = "sa"
DB_PASSWORD = "Nc220370979"
DB_SERVER = "localhost"
DB_DATABASE = "EnhancedUsersDB"
SQL_CONN_STRING = f"mssql+pyodbc://{DB_USERNAME}:{DB_PASSWORD}@{DB_SERVER}/{DB_DATABASE}?driver=ODBC+Driver+17+for+SQL+Server"

engine = create_engine(SQL_CONN_STRING)



async def get_token_header(id_token: Annotated[str, Header("AuthenticationToken")]):
    try:
        # Validate the token against the database.
        async with engine.connect() as connection:
            result = await connection.execute(text("SELECT COUNT(*) FROM EnhancedUsers WHERE ID = :idtoken"), {"idtoken": id_token})
            count = result.scalar()

        if count == 0:
            raise HTTPException(status_code=400, detail="INVALID ACCESS CLEARANCE : PREPARE TO BE HIT WITH A COGNITOHAZARD")
    except SQLAlchemyError as e:
        # Handle specific SQLAlchemy exceptions
        if "No such table" in str(e):
            raise HTTPException(status_code=404, detail="Table not found.")
        else:
            raise HTTPException(status_code=500, detail="Database error occurred.")
    except Exception as e: 
        print(e)
        raise HTTPException(status_code=500, detail="CLEARANCE CHECK ERROR : PLEASE TRY AGAIN")
