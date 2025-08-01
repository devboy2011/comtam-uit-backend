/**
 * Tự thêm trường slug cho database
 * cd backend && node scripts/add-slug-to-existing-blogs.js
 */

require('dotenv').config()
const mongoose = require('mongoose')
const slugify = require('slugify')

// Kết nối database
const connectionString =
  process.env.PRODUCT_MONGODB_URI || 'mongodb://localhost:27017/myticket'

// Schema cho collection article_details
const blogSchema = new mongoose.Schema(
  {
    article_id: {
      type: Number,
      unique: true,
    },
    article_friendly_time: {
      type: String,
    },
    article_datetime: {
      type: Date,
    },
    published_date: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    short_description: {
      type: String,
    },
    thumpnail: {
      type: String,
    },
    author: {
      type: String,
    },
    summary: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: [String],
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogCategory',
    },
  },
  {
    timestamps: true,
    collection: 'article_details',
  },
)

const Blog = mongoose.model('BlogMigration', blogSchema)

// Hàm tạo slug unique
async function generateUniqueSlug(title, excludeId = null) {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
  })

  let slug = baseSlug
  let counter = 1

  // Kiểm tra slug đã tồn tại chưa
  while (true) {
    const existingSlug = await Blog.findOne({
      slug: slug,
      ...(excludeId && { _id: { $ne: excludeId } }),
    })

    if (!existingSlug) {
      break
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

async function migrateAllSlugs() {
  try {
    console.log('Kết nối tới MongoDB...')
    await mongoose.connect(connectionString)
    console.log('Kết nối MongoDB thành công')

    // Tìm tất cả blog không có slug
    const blogsWithoutSlug = await Blog.find({
      $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
    })

    console.log(`Tìm thấy ${blogsWithoutSlug.length} blog không có slug`)

    if (blogsWithoutSlug.length === 0) {
      console.log('Tất cả blog đã có slug!')
      return
    }

    let processedCount = 0
    const totalCount = blogsWithoutSlug.length

    // Xử lý từng blog
    for (const blog of blogsWithoutSlug) {
      try {
        if (blog.title) {
          // Tạo slug unique
          const uniqueSlug = await generateUniqueSlug(blog.title, blog._id)

          // Cập nhật slug
          await Blog.updateOne(
            { _id: blog._id },
            { $set: { slug: uniqueSlug } },
          )

          processedCount++

          // Hiển thị progress
          if (processedCount % 50 === 0 || processedCount === totalCount) {
            console.log(`Đã xử lý ${processedCount}/${totalCount} blog`)
          }

          console.log(`${blog.title} -> ${uniqueSlug}`)
        } else {
          console.log(`Blog ${blog._id} không có title, bỏ qua`)
        }
      } catch (error) {
        console.error(`Lỗi khi xử lý blog ${blog._id}:`, error.message)
      }
    }

    console.log(`\nHoàn thành migration!`)
    console.log(`Đã tạo slug cho ${processedCount} blog`)

    // Kiểm tra lại
    const remainingBlogs = await Blog.countDocuments({
      $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
    })

    console.log(`Còn lại ${remainingBlogs} blog chưa có slug`)
  } catch (error) {
    console.error(' Lỗi migration:', error)
    process.exit(1)
  } finally {
    console.log('Đóng kết nối database...')
    await mongoose.connection.close()
    console.log('Đã đóng kết nối database')
    process.exit(0)
  }
}

// Chạy migration
console.log('Bắt đầu migration slug cho blogs...')
migrateAllSlugs()
