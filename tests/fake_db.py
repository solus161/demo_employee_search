import sqlite3
import pandas as pd

if __name__ == "__main__":
    # Create a fake db in sqlite
    conn = sqlite3.connect('../backend/database.db')
    cursor = conn.cursor()

    # Create table
    cursor.execute(
        """
        create table if not exists tbl_user (
            id integer primary key,
            username text unique not null,
            email text unique not null,
            department text,
            password not null
        )
        """
    )

    conn.commit()
    
    cursor.execute(
        """
        create table if not exists tbl_employee (
            id text primary key,
            first_name text not null,
            last_name text not null,
            birthdate text,
            gender text,
            race text,
            department text,
            jobtitle text,
            location text,
            hire_date text,
            termdate text,
            location_city text,
            location_state text
        );
        """)
    conn.commit()

    cursor.execute(
        """
        create table if not exists tbl_department (
            id integer primary key,
            name text unique not null,
            authorized_columns text
        )
        """
    )
    conn.commit()

    # Load sample data
    df = pd.read_csv('data/hr.csv')
    df.to_sql('tbl_employee', conn, if_exists = 'append', index = False)

    # Fake authorized data
    departments = [
        ('Human Resources', 'id,first_name,last_name,birthdate,gender,race,department,jobtitle,location,hire_date,termdate,location_city,location_state'),
        ('Business Development', 'id,first_name,last_name,birthdate,gender,race,department,jobtitle')
    ]

    cursor.executemany(
        """
        insert into tbl_department (name, authorized_columns)
        values (?, ?)
        """, 
        departments
    )
    conn.commit()

    print('Fake db create at backend/database.db')
    conn.close()