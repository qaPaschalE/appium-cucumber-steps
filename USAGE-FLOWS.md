# Usage Flows - Development vs Production

## 🚀 PRODUCTION (After Publishing to npm)

### What End Users Do

```bash
# Create new project
mkdir my-app-tests
cd my-app-tests
npm init -y

# Install your package from npm
npm install appium-cucumber-steps

# Initialize project structure
npx appium-cucumber-init

# Run tests
npm test
```

**Total:** 3 commands (after npm init)

### What They Get

```
my-app-tests/
├── apps/
│   └── ApiDemos-debug.apk        ✓ Ready to test
├── features/
│   ├── scenarios/                 ✓ Example tests
│   ├── step_definitions/
│   │   ├── hooks.ts
│   │   └── steps.ts              ✓ Loads all pre-built steps
│   └── support/
│       └── world.ts
├── wdio.conf.ts                  ✓ Pre-configured
├── package.json                  ✓ Test scripts included
└── node_modules/
    └── appium-cucumber-steps/    ✓ All dependencies included
```

---

## 🔧 DEVELOPMENT (Before Publishing - For You)

### Local Testing Workflow

```bash
# In your package directory
cd appium-cucumber-steps

# Build
npm run build

# Create tarball for testing
npm pack
# Output: appium-cucumber-steps-1.0.0.tgz

# Create test directory
cd ..
mkdir test-local
cd test-local

# Initialize
npm init -y

# Install from LOCAL tarball (simulates npm install)
npm install ../appium-cucumber-steps/appium-cucumber-steps-1.0.0.tgz

# Initialize project
npx appium-cucumber-init

# Run tests
npm test
```

### Why Use Tarball for Testing?

| Method                  | Dependencies Work? | Simulates Production? | Use Case                                         |
| ----------------------- | ------------------ | --------------------- | ------------------------------------------------ |
| `npm link`              | ❌ No              | ❌ No                 | Quick development (broken for this package type) |
| `npm pack` + install    | ✅ Yes             | ✅ Yes                | **Pre-publish testing (RECOMMENDED)**            |
| `npm install <package>` | ✅ Yes             | ✅ Yes                | After publishing                                 |

**Important:** With `npm link`, dependencies like `@wdio/spec-reporter` won't be accessible to the user project. Always test with tarball before publishing!

---

## 📦 Publishing Workflow

```bash
# 1. Ensure everything is committed
git add .
git commit -m "Ready for v1.0.0"

# 2. Build
npm run build

# 3. Test with tarball (as shown above)
cd ../test-local
npm install ../appium-cucumber-steps/appium-cucumber-steps-1.0.0.tgz
npx appium-cucumber-init
npm test

# 4. If tests pass, publish
cd ../appium-cucumber-steps
npm publish

# 5. Test the published package
cd ../test-published
npm init -y
npm install appium-cucumber-steps  # From npm registry now!
npx appium-cucumber-init
npm test
```

---

## 🎯 Quick Reference

### For Package Developer (You)

**Testing locally:**

```bash
npm run build && npm pack
cd ../test && npm install ../pkg/appium-cucumber-steps-*.tgz
```

**Publishing:**

```bash
npm publish
```

### For End Users (After Publish)

**Installation:**

```bash
npm install appium-cucumber-steps
npx appium-cucumber-init
npm test
```

---

## ❓ FAQ

### Q: Why can't I use `npm link` for testing?

**A:** `npm link` creates a symlink but doesn't install the package's dependencies in the user's `node_modules`. Plugins like reporters won't be found.

### Q: Will users need to install the tarball?

**A:** No! The tarball (`npm pack`) is only for YOUR testing before publishing. After `npm publish`, users install normally: `npm install appium-cucumber-steps`

### Q: What's the difference between tarball and published package?

**A:** None functionally. The tarball IS what gets published to npm. Testing with tarball ensures it will work exactly the same way after publishing.

### Q: Do users need to know about tarballs?

**A:** No! Users never see tarballs. They just run `npm install appium-cucumber-steps` and it works.

---

## 📋 Pre-Publish Checklist

Before running `npm publish`:

- [ ] `npm run build` succeeds
- [ ] `npm pack` creates tarball
- [ ] Install from tarball in clean directory
- [ ] `npx appium-cucumber-init` works
- [ ] APK is copied to apps/
- [ ] Scenarios are copied to features/scenarios/
- [ ] `npm test` runs (with Appium + emulator)
- [ ] All dependencies accessible (no missing reporter errors)
- [ ] Version bumped in package.json
- [ ] README accurate
- [ ] LICENSE file exists

---

## 🎉 Success Criteria

### After `npm publish`, users should be able to:

1. ✅ Run `npm install appium-cucumber-steps` (one command)
2. ✅ Run `npx appium-cucumber-init` (one command)
3. ✅ Run `npm test` (one command, with Appium running)
4. ✅ Get a working test project with APK and examples
5. ✅ Have all dependencies available
6. ✅ See tests running successfully

**That's it. Three commands total.**
