# Use the official Node.js image as a base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY edmserver/package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of your application code
COPY edmserver/ .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application with nodemon
CMD ["npm", "start"]