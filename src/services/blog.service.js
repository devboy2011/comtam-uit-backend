'use strict'

const blogRepository = require('../models/repositories/blog.repository')
const blogModel = require('../models/blog.model')
const blogCategory = require('../models/blog-category.model')
const { BadRequestError } = require('../core/error.response')
class BlogService {
  // Create
  static async createBlog(payload) {
    return await blogModel.create(payload)
  }

  // Update
  static async updateBlog(blogId, payload) {
    const blog = await blogModel.findByIdAndUpdate(blogId, payload, {
      new: true,
    })
    if (!blog) throw new BadRequestError(`Blog not found with Id: ${blogId}`)

    return blog
  }

  // Delete
  static async deleteBlog(blogId) {
    const blog = await blogModel.findByIdAndDelete(blogId)

    if (!blog) throw new BadRequestError(`Blog not found with Id: ${blogId}`)

    return blog
  }

  // Query
  static async findAllBlogs({
    limit = 10, // Số lượng blog mỗi trang
    sort = 'ctime', // Lấy thời gian mới nhất
    page = 1, // Trang hiện tại
    select = [], // Chọn fields cần trả về
    category, // Filter theo danh mục
  }) {
    // Convert into array
    let selectFields = select
    if (typeof select === 'string') {
      selectFields = select.split(',').map((field) => field.trim())
    }

    const filter = {}

    return await blogRepository.findAllBlogs({
      limit,
      sort,
      page,
      filter,
      category,
      select: selectFields, // Tùy chỉnh ['title', 'author', ...],
    })
  }

  static async findBlogBySlug({ slug }) {
    return await blogRepository.findBlogBySlug({ slug })
  }

  static async getListSearchBlog({ keySearch }) {
    return await blogRepository.searchBlog({ keySearch })
  }
}

module.exports = BlogService
