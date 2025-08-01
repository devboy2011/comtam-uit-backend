const {CATEGORIES, RES_LOCATIONS} = require('../utils/enums')
const {requestToresponseLocation} = require('../utils/location.mapper');

const Event = require('../models/event.model');
const BannerEvent = require('../models/banner-events.model');
const SpecialEvent = require('../models/special-event.model');
const EventDetails = require('../models/event-details.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllEvents = async (req, res) => {
  try {
  
    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const limit = parseInt(req.query.limit) || 10; // Số lượng sự kiện mỗi trang
    const skip = (page - 1) * limit; // Số lượng bản ghi cần bỏ qua
    
    const{ location, isFree, category, startDate, endDate } = req.query;
    const filter = {};
    
    // Kiểm tra và xử lý các tham số lọc
    if (category && !Object.values(CATEGORIES).includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    if (startDate && isNaN(Date.parse(startDate))) {
      return res.status(400).json({ error: 'Invalid start Date' });
    }
    
    if (endDate && isNaN(Date.parse(endDate))) {
      return res.status(400).json({ error: 'Invalid end Date' });
    }
    
    // Tạo bộ lọc dựa trên các tham số
    if (location) {
      if (location === "Khác")
        filter.location = { $nin: [RES_LOCATIONS.HCM, RES_LOCATIONS.HN, RES_LOCATIONS.DL] }
      else
        filter.location = { $in: [location] }
    } 
    if (isFree) filter.price = { $eq : 0};
    if (category) filter.categories = { $in: [category] };
    if (startDate) filter.day = { $gte: new Date(startDate) };
    if (endDate) {
      const trueEndDate = new Date(endDate).setDate(new Date(endDate).getDate() + 1)
      filter.day = { ...filter.day, $lt: trueEndDate };
    }
    
    filter.deletedAt = null;
 
    const eventList = await Event
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ day: -1, startTime: 1 });
        
    const totalEvents = await Event.countDocuments(filter);
    const totalPages = Math.ceil(totalEvents / limit);
            
    if (!eventList || eventList.length === 0) 
      return res.status(200).json({ 
        message: 'No event found',
        body: []      
    });
    
    return res.status(200).json({
      message: 'Events retrieved successfully',
      body: eventList,
      totalPages,
      currentPage: page,
    })
    
  } catch (err) {
      res.status(404).json({ error: "Service not supported" });
  }
};

exports.getEventBySlug = async (req, res) => {
  try {

    const { slug } = req.params;
    
    const event = await Event.findOne({ url : slug, deletedAt: null});
    
    if (!event)
      return res.status(201).json({ error: 'Event not found' });

    const eventDetails = await EventDetails.findOne({ url: slug });
    
    if (!eventDetails) {
      return res.status(201).json({ error: 'Event not found' });
    }
    
    res.status(200).json({
      message: 'Event details retrieved successfully',
      body: eventDetails,
    });
  } catch (err) {
    res.status(404).json({ error: "Service not supported" });
  }
};

exports.getEventByKeyword = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    const regex = new RegExp(keyword, 'i'); // 'i' for case-insensitive search

    const events = await Event.find({ name: {$regex : regex} });
    
    if (!events) {
      return res.status(201).json({ error: 'Event not found' });
    }
    
    if (events.length === 0) {
      res.status(200).json({
        message: 'No events matched the keyword',
        body: events,
      });
    }
    
    res.status(200).json({
      message: 'Events retrieved successfully',
      body: events,
    });
  } catch (err) {
    res.status(404).json({ error: "Service not supported" });
  }
};

exports.getBannerEvents = async (req, res) => {

  try {
    const bannerEvents = await BannerEvent.find({deletedAt: null}).sort({ showingTime: -1 });
    
    res.status(200).json({
      message: 'Banner events retrieved successfully',
      body: bannerEvents,
    });
  }
  catch (err) {
    res.status(404).json({ error: "Service not supported" });
  }
}

exports.getSpecialEvents = async (req, res) => {
  try {
    const specialEvents = await SpecialEvent.find({deletedAt: null});
  
    res.status(200).json({
      message: 'Banner events retrieved successfully',
      body: specialEvents,
    });
  }
  catch (err) {
    res.status(404).json({ error: "Service not supported" });
  }
}