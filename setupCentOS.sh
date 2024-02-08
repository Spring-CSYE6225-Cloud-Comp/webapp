#!/bin/bash
# Define database variables
DB_NAME="db1"
DB_USER="root"
DB_PASSWORD="root"
DB_HOST="localhost"
PORT="8080"


cd webapp-forked

# Create the .env file
cat <<EOF > .env
DB_NAME='$DB_NAME'  
DB_USER='$DB_USER'
DB_PASSWORD='$DB_PASSWORD'
DB_HOST='$DB_HOST' 
PORT=$PORT
EOF

echo ".env file has been created"

# Update package lists and upgrade installed packages
yum update -y

# Install nodejs and npm
yum install nodejs npm -y

# Check if MySQL is installed; if not, install it
if ! command -v mysql &> /dev/null; then
  echo "MySQL is not installed. Installing..." 
  yum install mysql-server -y
  echo "MySQL has been installed."
else
  echo "MySQL is already installed."
fi

# Set up MySQL database 
mysql -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
echo "MySQL database '$DB_NAME' has been created (if it didn't exist)."

# Install project dependencies  
echo "Installing project dependencies..."
npm install
npm uninstall mysql2
npm install mysql2@3.0.0 
echo "Project dependencies have been installed."

# Run your Node.js file
echo "Running your Node.js file..."
node app.js