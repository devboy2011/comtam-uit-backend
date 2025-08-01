'use strict'

const blogCategoryModel = require('../blog-category.model')

//GET
const findBlogCategoryBySlug = async ({slug}) => {
    return await blogCategoryModel.findOne({slug: slug})    
}

const findAllBlogCategories = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit // Số lượng bản ghi cần bỏ qua
  const sortBy =
    sort === 'ctime' ? { updatedAt: -1 } : { updatedAt: 1 } // Sort by time
  const blogs = await blogCategoryModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean()

  return blogs
}

module.exports = {
    findBlogCategoryBySlug,
    findAllBlogCategories,
}