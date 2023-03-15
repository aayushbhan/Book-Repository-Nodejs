# From the base image node
FROM node:alpine
WORKDIR /usr/src/app

# Copy all the files from your file system to the container file system
COPY package*.json .

# Install all dependencies
RUN npm install

# Copy other files as well
COPY . .

# Command to execute when the image is instantiated
CMD ["npm","run","start"]