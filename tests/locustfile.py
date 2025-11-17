from locust import HttpUser, task, between
import random

class TestEmployeeSearch(HttpUser):
    wait_time = between(1, 1)

    # Some search terms
    search_string = ["mame landrean", "bruis pankhurst.", "audrye brain", "friedrick shillabear"]
    locations = ["Ohio", "Michigan"]
    companies = ["Cleveland", "Detroit"]
    departments = ["Engineering", "Marketing", "Human Resources", "Training"]
    positions = ["Computer Systems Analyst I", "Editor", "Human Resources Analyst II", "Trainer II"]
    users = ['user01', 'user02']

    @task
    def search_employees(self):
        self.client.get(
            url = '/api/v1/employees',
            auth = (random.choice(self.users), '1'),
            params = {
                'search_str': random.choice(self.search_string),
                'location': random.choice(self.locations),
                'company': random.choice(self.companies),
                'deparment': random.choice(self.departments),
                'position': random.choice(self.positions),
                'page': 1
            })