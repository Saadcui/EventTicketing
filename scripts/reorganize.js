/**
 * This script helps reorganize the project structure
 * It creates the necessary directories and moves files
 * while updating imports
 */

const fs = require("fs")
const path = require("path")

// Create directories if they don't exist
const directories = [
  "frontend",
  "frontend/components",
  "frontend/hooks",
  "frontend/utils",
  "backend",
  "backend/lib",
  "backend/lib/supabase",
  "backend/lib/actions",
  "backend/api",
]

directories.forEach((dir) => {
  const dirPath = path.join(__dirname, "..", dir)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`Created directory: ${dir}`)
  }
})

console.log("Directory structure created successfully")
console.log("To move files, run:")
console.log("npm run move-files")

// Instructions for next steps
console.log("\nNext steps:")
console.log("1. Move components to frontend/components/")
console.log("2. Move hooks to frontend/hooks/")
console.log("3. Move server actions to backend/lib/actions/")
console.log("4. Update imports in all files")
console.log("5. Test the application")
