#!/usr/bin/env python3
"""
Demo script for Email Management System
Demonstrates all the functionality including adding, activating, deactivating, and deleting emails.
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000/api"

def print_separator():
    print("=" * 60)

def print_response(response, operation):
    print(f"\n{operation}:")
    if response.status_code < 400:
        if response.content:
            print(json.dumps(response.json(), indent=2))
        else:
            print("✅ Success - No content returned")
    else:
        print(f"❌ Error {response.status_code}: {response.text}")

def get_all_emails():
    """Get all emails from the system"""
    response = requests.get(f"{BASE_URL}/emails")
    print_response(response, "📋 Getting all emails")
    return response.json() if response.status_code == 200 else []

def add_email(email):
    """Add a new email"""
    response = requests.post(f"{BASE_URL}/emails", 
                           json={"email": email},
                           headers={"Content-Type": "application/json"})
    print_response(response, f"➕ Adding email: {email}")
    return response.json() if response.status_code == 201 else None

def activate_email(email_id):
    """Activate an email"""
    response = requests.put(f"{BASE_URL}/emails/{email_id}/activate")
    print_response(response, f"✅ Activating email ID: {email_id}")
    return response.json() if response.status_code == 200 else None

def deactivate_email(email_id):
    """Deactivate an email"""
    response = requests.put(f"{BASE_URL}/emails/{email_id}/deactivate")
    print_response(response, f"⏸️ Deactivating email ID: {email_id}")
    return response.json() if response.status_code == 200 else None

def delete_email(email_id):
    """Delete an email"""
    response = requests.delete(f"{BASE_URL}/emails/{email_id}")
    print_response(response, f"🗑️ Deleting email ID: {email_id}")
    return response.status_code == 200

def demo():
    """Run the complete demo"""
    print("🚀 Email Management System Demo")
    print_separator()
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/emails")
        if response.status_code != 200:
            print("❌ Server is not responding correctly")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure the Flask app is running on http://localhost:5000")
        return
    
    print("✅ Connected to Email Management System")
    
    # Get initial state
    print_separator()
    initial_emails = get_all_emails()
    
    # Add some demo emails
    print_separator()
    demo_emails = [
        "john.doe@company.com",
        "jane.smith@organization.org",
        "admin@website.net",
        "support@service.io"
    ]
    
    added_emails = []
    for email in demo_emails:
        result = add_email(email)
        if result:
            added_emails.append(result)
        time.sleep(0.5)  # Small delay for better demo experience
    
    # Show all emails after adding
    print_separator()
    all_emails = get_all_emails()
    
    # Demonstrate activation
    print_separator()
    if added_emails:
        # Activate first two emails
        for i in range(min(2, len(added_emails))):
            activate_email(added_emails[i]['id'])
            time.sleep(0.5)
    
    # Show emails after activation
    print_separator()
    all_emails = get_all_emails()
    
    # Demonstrate deactivation
    print_separator()
    if added_emails:
        # Deactivate the first email
        deactivate_email(added_emails[0]['id'])
        time.sleep(0.5)
    
    # Show final state
    print_separator()
    final_emails = get_all_emails()
    
    # Show statistics
    print_separator()
    if final_emails:
        total = len(final_emails)
        active = len([e for e in final_emails if e['status'] == 'active'])
        inactive = len([e for e in final_emails if e['status'] == 'inactive'])
        
        print("📊 Final Statistics:")
        print(f"   Total Emails: {total}")
        print(f"   Active Emails: {active}")
        print(f"   Inactive Emails: {inactive}")
    
    # Cleanup demo (optional)
    print_separator()
    cleanup = input("🧹 Do you want to clean up demo data? (y/N): ").strip().lower()
    if cleanup == 'y':
        for email_data in added_emails:
            delete_email(email_data['id'])
            time.sleep(0.3)
        
        print_separator()
        print("🧹 Cleanup completed!")
        get_all_emails()
    
    print_separator()
    print("✨ Demo completed! Open http://localhost:5000 in your browser to see the UI")
    print_separator()

if __name__ == "__main__":
    demo()