import random
import string
import requests
import threading
from colorama import Fore, Style, init

init(autoreset=True)

def random_name():
    first_names = ['Rahim', 'Karim', 'Hasan', 'Rafiq', 'Sajid', 'Amin', 'Farhan', 'Tareq']
    last_names = ['Ahmed', 'Hossain', 'Chowdhury', 'Rahman', 'Khan', 'Miah', 'Bhuiyan', 'Sarkar']
    return f"{random.choice(first_names)} {random.choice(last_names)}"

def random_gmail():
    username_length = random.randint(5, 10)
    username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=username_length))
    return f"{username}@gmail.com"

def random_phone_number():
    remaining_digits = ''.join(random.choices(string.digits, k=8))
    return f"017{remaining_digits}"

def post_data():
    url = "https://golperjhuri.com/register.php"
    account_count = 0
    email_file_path = "/sdcard/emailsx.txt"

    while True:
        random_name_value = random_name()
        random_email = random_gmail()
        random_phone = random_phone_number()

        data = {
            "indecator": "1",
            "user_name": random_name_value,
            "user_email": random_email,
            "user_phon": random_phone,
            "user_adress": "Madhupur",
            "user_school": "Dhaka",
            "user_education": "10",
            "user_pass": "@@@@11Aa",
            "user_pass_check": "@@@@11Aa",
            "user_location": "ঢাকা",
            "gender": "1",
            "numone": "9",
            "numtwo": "0",
            "result": "9",
            "confarm_registration": "নিবন্ধন করুন",
        }

        response = requests.post(url, data=data)

        if response.status_code == 200:
            account_count += 1
            print(f"{Fore.GREEN}[SUCCESS]{Style.RESET_ALL} {account_count}: {random_email}")
            with open(email_file_path, "a") as file:
                file.write(random_email + "\n")
        else:
            print(f"{Fore.RED}[FAILED]{Style.RESET_ALL} Status Code: {response.status_code}")

thread = threading.Thread(target=post_data, daemon=True)
thread.start()

while True:
    pass  # Keeps the script running
