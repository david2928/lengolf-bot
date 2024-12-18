# LEN Golf LINE Bot

A Node.js application that serves as a LINE bot for LEN Golf, providing information about golf packages and bay availability. This is a migration from the original Google Apps Script implementation to a more scalable Node.js solution.

## Features

### Currently Implemented
- **Package Information**
  - Check packages by person name (`/checkpackages_by_person`)
  - Check packages by package type (`/checkpackages_by_package`)
  - Integration with Supabase for package data

### Testing Infrastructure
- Comprehensive test suite that simulates LINE webhook events
- Test mode that captures bot responses without making actual LINE API calls
- Ability to test all endpoints without external dependencies

## Project Structure
```
lengolf-bot/
├── src/
│   ├── app.js           # Main application entry point
│   ├── config.js        # Configuration management
│   ├── database.js      # Supabase database interactions
│   ├── handlers.js      # Command handlers
│   ├── line.js         # LINE messaging functionality
│   └── utils.js        # Utility functions
├── tests/
│   ├── manual-test.js   # Test runner
│   └── testUtils.js     # Test utilities
├── .env                 # Environment variables
└── package.json         # Project dependencies
```

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   - LINE_ACCESS_TOKEN
   - SUPABASE_URL
   - SUPABASE_KEY
   - Calendar IDs for each bay

## Running the Application
Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Testing
Run the test suite:
```bash
npm test
```

## Outstanding Tasks

### Features to Implement
1. **Calendar Integration**
   - [ ] Implement real Google Calendar integration for bay availability
   - [ ] Connect with actual calendar instances
   - [ ] Handle timezone considerations

2. **Availability Commands**
   - [ ] `/availability_today`
   - [ ] `/availability_tomorrow`
   - [ ] `/availability_datepicker`

3. **Database Integration**
   - [ ] Complete Supabase view integration
   - [ ] Error handling for database operations
   - [ ] Connection pooling and optimization

### Technical Improvements
1. **Testing**
   - [ ] Add response content validation
   - [ ] Add edge case testing
   - [ ] Add database mock for testing
   - [ ] Add integration tests with actual Supabase

2. **Error Handling**
   - [ ] Add more robust error handling
   - [ ] Add error logging
   - [ ] Add recovery mechanisms

3. **Deployment**
   - [ ] Set up CI/CD pipeline
   - [ ] Create deployment documentation
   - [ ] Configure production environment
   - [ ] Set up monitoring and logging

4. **Documentation**
   - [ ] Add API documentation
   - [ ] Add setup guide for new developers
   - [ ] Add troubleshooting guide

### Security Improvements
1. **Authentication**
   - [ ] Implement webhook signature validation
   - [ ] Add rate limiting
   - [ ] Secure sensitive configurations

2. **Data Protection**
   - [ ] Add data sanitization
   - [ ] Implement request validation
   - [ ] Add security headers

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
[Specify License]

## Authors
- [List Authors]

## Acknowledgments
- Original Google Apps Script implementation
- LINE Messaging API
- Supabase team for the database platform