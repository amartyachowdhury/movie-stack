# 🔒 Security Guide

## 🚨 Important Security Notes

### **Never Commit Secrets to Version Control**

This repository contains sensitive information that should **NEVER** be committed to a public repository:

- API keys
- Database passwords
- Secret keys
- Access tokens

### **What to Do If You've Exposed a Secret**

1. **Immediately revoke the exposed secret**
   - Go to the service provider (TMDB, etc.)
   - Generate a new API key/token
   - Delete the old one

2. **Remove the secret from git history**
   ```bash
   # Remove the secret from the last commit
   git reset --soft HEAD~1
   
   # Or use BFG Repo-Cleaner for more thorough cleaning
   # https://rtyley.github.io/bfg-repo-cleaner/
   ```

3. **Update your local .env file**
   - Replace the old secret with the new one
   - Ensure .env is in .gitignore

### **Proper Secret Management**

#### **1. Use Environment Variables**
```bash
# Create a .env file (never commit this!)
cp env.example .env

# Edit .env with your real secrets
TMDB_API_KEY=your_real_api_key_here
SECRET_KEY=your_real_secret_key_here
```

#### **2. Use Docker Secrets (Production)**
```yaml
# docker-compose.yml
services:
  backend:
    secrets:
      - tmdb_api_key
      - db_password

secrets:
  tmdb_api_key:
    file: ./secrets/tmdb_api_key.txt
  db_password:
    file: ./secrets/db_password.txt
```

#### **3. Use Cloud Secret Management**
- **AWS**: AWS Secrets Manager
- **Azure**: Azure Key Vault
- **Google Cloud**: Secret Manager
- **Heroku**: Config Vars

### **Current Security Status**

✅ **Fixed Issues:**
- Removed hardcoded TMDB API key from docker-compose.yml
- Added .gitignore to prevent .env files from being committed
- Created env.example template
- Updated documentation with security warnings

### **Security Checklist**

- [ ] No hardcoded secrets in source code
- [ ] .env file is in .gitignore
- [ ] All secrets are in environment variables
- [ ] API keys are rotated regularly
- [ ] Database passwords are strong and unique
- [ ] Production secrets are managed securely

### **Emergency Contact**

If you discover a security vulnerability or exposed secret:

1. **Immediately revoke the secret**
2. **Create a new secret**
3. **Update all systems using the old secret**
4. **Consider the secret compromised**

### **Best Practices**

1. **Use strong, unique passwords**
2. **Rotate secrets regularly**
3. **Use different secrets for different environments**
4. **Monitor for unauthorized access**
5. **Use secret scanning tools**
6. **Train team members on security practices**

---

**Remember: Security is everyone's responsibility!** 🔐
