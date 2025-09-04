# 🚀 Deployment Guide
## CS121 Interactive Lab Manual

This guide provides comprehensive deployment instructions for the CS121 Digital Logic Design Lab Manual.

## 📋 **Quick Deployment Options**

### **Option 1: Netlify (Recommended)**
1. **Connect GitHub Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository

2. **Configure Build Settings**
   ```
   Build command: (leave empty)
   Publish directory: /
   ```

3. **Deploy**
   - Click "Deploy site"
   - Your site will be live at `https://your-site-name.netlify.app`

### **Option 2: Vercel**
1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub

2. **Configure**
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: (leave empty)
   Output Directory: ./
   ```

3. **Deploy**
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

### **Option 3: GitHub Pages**
1. **Enable Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)"

2. **Access Your Site**
   - Your site will be live at `https://yourusername.github.io/repository-name`

## 🔧 **Custom Domain Setup**

### **Netlify**
1. Go to Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions

### **Vercel**
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed

## ⚙️ **Environment Configuration**

### **Update URLs**
Before deployment, update these URLs in `index.html`:

```html
<!-- Line 31 -->
<link rel="canonical" href="https://your-domain.com/">

<!-- Line 45 -->
<meta property="og:url" content="https://your-domain.com/">

<!-- Line 48 -->
<meta property="og:image" content="https://your-domain.com/media/apple-touch-icon.png">

<!-- Line 57 -->
<meta property="twitter:url" content="https://your-domain.com/">

<!-- Line 60 -->
<meta property="twitter:image" content="https://your-domain.com/media/apple-touch-icon.png">
```

### **Update Sitemap**
Update `sitemap.xml` with your domain:
```xml
<loc>https://your-domain.com/</loc>
```

### **Update Robots.txt**
Update `robots.txt` with your domain:
```
Sitemap: https://your-domain.com/sitemap.xml
```

## 📊 **Performance Optimization**

### **Enable Compression**
Most hosting platforms enable compression automatically, but verify:
- Gzip compression
- Brotli compression (if available)

### **CDN Configuration**
- **Netlify**: Automatic CDN included
- **Vercel**: Edge network included
- **GitHub Pages**: No CDN (consider Cloudflare)

### **Cache Headers**
Configure appropriate cache headers:
```
Static assets: 1 year
HTML files: 1 hour
Service Worker: 1 day
```

## 🔒 **Security Configuration**

### **HTTPS/SSL**
- **Netlify**: Automatic SSL certificates
- **Vercel**: Automatic SSL certificates
- **GitHub Pages**: Automatic SSL (enable in settings)

### **Security Headers**
The project includes security headers in the HTML. For additional security, configure server headers:

```nginx
# Nginx configuration
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

## 📱 **Testing Checklist**

### **Pre-Deployment Testing**
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (iOS, Android)
- [ ] Verify all interactive features work
- [ ] Check offline functionality
- [ ] Validate accessibility with screen reader
- [ ] Test keyboard navigation
- [ ] Verify PWA installation

### **Post-Deployment Testing**
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Test on slow 3G connection
- [ ] Verify all images load correctly
- [ ] Check console for errors
- [ ] Test service worker functionality
- [ ] Validate SEO meta tags

## 🚨 **Troubleshooting**

### **Common Issues**

**Service Worker Not Working**
- Ensure HTTPS is enabled
- Check browser console for errors
- Verify `sw.js` is accessible

**Images Not Loading**
- Check file paths are correct
- Verify images are in `media/` directory
- Ensure proper MIME types

**PWA Not Installing**
- Check manifest file is accessible
- Verify all required icons are present
- Ensure HTTPS is enabled

**Performance Issues**
- Enable compression
- Check image optimization
- Verify CDN is working

## 📈 **Monitoring & Analytics**

### **Performance Monitoring**
- **Lighthouse**: Regular performance audits
- **WebPageTest**: Detailed performance analysis
- **Google PageSpeed Insights**: Real-world performance data

### **Error Monitoring**
- **Sentry**: Error tracking and monitoring
- **LogRocket**: Session replay and error tracking
- **Browser console**: Regular error checking

### **Analytics (Optional)**
Add Google Analytics if needed:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 **Continuous Deployment**

### **Automatic Deployments**
- **Netlify**: Automatic deployment on Git push
- **Vercel**: Automatic deployment on Git push
- **GitHub Pages**: Automatic deployment on push to main branch

### **Branch Strategy**
```
main: Production deployment
develop: Staging deployment
feature/*: Feature development
```

## 📞 **Support**

For deployment issues:
1. Check this guide first
2. Review hosting platform documentation
3. Check browser console for errors
4. Verify all files are uploaded correctly

## 🎯 **Success Metrics**

After deployment, monitor:
- **Page Load Speed**: < 3 seconds
- **Lighthouse Score**: 90+ across all categories
- **Uptime**: 99.9% availability
- **User Engagement**: Lab completion rates
- **Error Rate**: < 1% error rate

---

**Ready to deploy? Follow the quick deployment options above and your educational platform will be live in minutes!** 🚀
