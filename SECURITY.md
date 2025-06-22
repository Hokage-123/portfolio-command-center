# 🔒 Security Configuration Guide

## ⚠️ IMPORTANT: API Key Setup Required

This application requires API keys to function properly. **Never commit API keys to version control!**

## 🔧 Setup Instructions

### 1. Create Configuration File
```bash
cp config.example.js config.js
```

### 2. Add Your API Keys
Edit `config.js` with your actual API keys:

```javascript
window.FIREBASE_API_KEY = "your-actual-firebase-api-key";
window.GEMINI_API_KEY = "your-actual-gemini-api-key";
```

### 3. Include in HTML
Add this line to your HTML `<head>` section:
```html
<script src="config.js"></script>
```

## 🔑 Getting API Keys

### Firebase API Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Scroll to "Your apps" section
5. Copy the `apiKey` value from your web app config

### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated key

## 🛡️ Security Best Practices

### ✅ DO:
- Keep `config.js` in `.gitignore`
- Use environment variables in production
- Restrict API keys to specific domains
- Regularly rotate API keys
- Monitor API key usage

### ❌ DON'T:
- Commit API keys to version control
- Share API keys in chat/email
- Use production keys in development
- Leave API keys unrestricted

## 🚨 Security Incident Response

If API keys are accidentally committed:

1. **Immediately revoke** the exposed keys
2. **Generate new keys**
3. **Update your configuration**
4. **Remove keys from Git history**:
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch config.js' \
   --prune-empty --tag-name-filter cat -- --all
   ```

## 🔍 Security Monitoring

- Enable Firebase App Check for additional security
- Monitor API usage in Google Cloud Console
- Set up billing alerts to detect unusual usage
- Review access logs regularly

## 📞 Reporting Security Issues

If you discover a security vulnerability, please:
1. **Do NOT** create a public issue
2. Email security concerns privately
3. Include detailed reproduction steps
4. Allow time for responsible disclosure

---

**Remember: Security is everyone's responsibility!** 🔒
