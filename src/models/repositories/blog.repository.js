'use strict'

const blogModel = require('../blog.model')
const blogCategoryModel = require('../blog-category.model')
const { BadRequestError } = require('../../core/error.response')
// GET
const findAllBlogs = async ({
  limit,
  sort,
  page,
  filter,
  category,
  select,
}) => {
  const skip = (page - 1) * limit // Số lượng bản ghi cần bỏ qua
  const sortBy =
    sort === 'ctime' ? { article_datetime: -1 } : { article_datetime: 1 } // Sort by time

  // Filter by category
  if (category) {
    const blogCategory = await blogCategoryModel.findOne({
      name: { $regex: category, $options: 'i' }
    })

    if (blogCategory) {
      filter.category_id = blogCategory._id
    } else {
      throw new BadRequestError(`Not found category ${category}`)
    }
  }

  const blogs = await blogModel
    .find(filter)
    .populate('category_id', 'name -_id')
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean()

  return blogs
}
const findBlogBySlug = async ({ slug }) => {
   const blog = await blogModel
    .findOne({ slug: slug })
    .populate('category_id', 'name -_id')

    if(!blog){
      throw new BadRequestError(`Not found with slug: ${slug}`)
    }

    return blog
}

// Search
const searchBlog = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch)
  const result = await blogModel
    .find(
      {
        $text: { $search: regexSearch },
      },
      { score: { $meta: 'textScore' } },
    )
    .populate('category_id', 'name -_id')
    .sort({ score: { $meta: 'textScore' } })
    .lean()
  return result
}

module.exports = {
  searchBlog,
  findAllBlogs,
  findBlogBySlug,
}
