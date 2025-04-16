const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config(); // Load environment variables from .env file

//Importing routes
const authRoutes = require('./routes/auth');
