import psycopg
import pandas as pd
from tqdm import tqdm

if __name__ == "__main__":
    # Connect to your postgres DB
    connect_params = {
        'host': 'localhost',
        'port': 5432,
        'database': 'learning',
        'user': 'postgres',
        'password': '1'
    }
    conn = psycopg.connect("""
        host={host} port={port} dbname={database} user={user} password={password}
    """.format(**connect_params))
    cursor = conn.cursor()

    # Load sample data
    df = pd.read_csv('data/hr.csv')
    df = df.iloc[:20000,:]
    df = df[['first_name', 'last_name', 'location_city', 'location_state', 'department', 'jobtitle']].copy()
    df.rename(columns={
        'location_state': 'location',
        'location_city': 'company',
        'jobtitle': 'position'}, inplace=True)

    data = []
    for i, row in df.iterrows():
        data.append((
            row['first_name'],
            row['last_name'],
            None,
            row['location'],
            row['company'],
            row['department'],
            row['position']
        ))
    
    # Fake a 20m records by inserting the same 20k records 1000 times
    for i in tqdm(range(1000)):
        cursor.executemany("""
            insert into tbl_employees (
                first_name, last_name, contact_info, location, company, department, position)
            values (%s, %s, %s, %s, %s, %s, %s)""", data)
        conn.commit()
    conn.close()