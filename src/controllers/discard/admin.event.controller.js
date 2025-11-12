const Event = require('../models/discard/event.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const EventDetail = require('../models/discard/event-details.model');

const { jwtSecret, jwtExpiresIn } = require('../configs/jwt.config');

exports.addEvent = async (req, res) => {
  try {

    const addData = req.body;

    if (!addData.title || !addData.url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }

    const existingEvent = await Event.findOne({ url: addData.url.toLowerCase() });
    if (existingEvent) {
      return res.status(400).json({ error: 'Event with this URL already exists' });
    }

    // Lấy giá thấp nhất từ showings[].ticketTypes[].price
    let minPrice = 0;
    if (Array.isArray(addData.showings) && addData.showings.length > 0) {
      const allTicketTypes = addData.showings
        .map(s => Array.isArray(s.ticketTypes) ? s.ticketTypes : [])
        .flat();
      if (allTicketTypes.length > 0) {
        minPrice = Math.min(...allTicketTypes.map(t => t.price || 0));
      }
    }

    const newEvent = new Event({
      name: addData.title,
      url: addData.url.toLowerCase(),
      imageUrl: addData.bannerURL,
      categories: addData.categoriesV2,
      day: addData.startTime,
      price: minPrice,
      version: '1.1.0',
      location: addData.location
    });
    
    const savedEvent = await newEvent.save();

    const updatedEvent = await Event.updateOne(
      {id: savedEvent.id},
      {$set : {
        originalId : savedEvent.id
      }
    });
    
    if (!savedEvent) {
      return res.status(500).json({ error: 'Failed to create event' });
    }

    const eventDetail = new EventDetail({
      title: addData.title,
      url: addData.url.toLowerCase(),
      description: addData.description,
      address: addData.address,
      location: addData.location,
      venue: addData.venue,
      orgName: addData.orgName,
      orgDescription: addData.orgDescription,
      orgLogoURL: addData.orgLogoURL,
      categoriesV2: addData.categoriesV2,
      startTime: addData.startTime,
      endTime: addData.endTime,
      bannerURL: addData.bannerURL,
      showings: addData.showings,
      originalId: savedEvent.id,
      id: savedEvent.id, 
    });

    const savedEventDetail = await eventDetail.save();

    if (!savedEventDetail) {
      const deleteEvent = Event.deleteOne({ id: eventDetail.id })
      return res.status(500).json({ error: 'Failed to create event detail' });
      
    }

    return res.status(200).json({
      message: 'create event successfully',
      body: newEvent
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {

    const { id } = req.params;

    const event = await Event.updateOne(
      { id: id },
      { $set: { deletedAt: new Date() } }
    );

    if (event.nModified === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventDetail = await EventDetail.updateOne(
      { id: id },
      { $set: { deletedAt: new Date() } }
    );

    if (eventDetail.nModified === 0) {
      return res.status(404).json({ error: 'Event detail not found' });
    }

    return res.status(200).json({
      message: 'Delete event successfully',
      body: { id }
    })

  } catch (err) {
    if (res.statusCode !== 401)
      res.status(500).json({ error: err.message });
  }
};

exports.updateEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedEventDetail = await EventDetail.findOneAndUpdate(
      { id: id },
      { $set: updateData }
    )

    // Lấy giá thấp nhất từ showings[].ticketTypes[].price
    let minPrice = 0;
    if (Array.isArray(updateData.showings) && updateData.showings.length > 0) {
      const allTicketTypes = updateData.showings
        .map(s => Array.isArray(s.ticketTypes) ? s.ticketTypes : [])
        .flat();
      if (allTicketTypes.length > 0) {
        minPrice = Math.min(...allTicketTypes.map(t => t.price || 0));
      }
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { id: updatedEventDetail.id },
      {
        $set: {
          url: updateData.url,
          name: updateData.title,
          imageUrl: updateData.bannerURL,
          day: updateData.startTime,
          price: minPrice,
          location: updateData.location || "Hồ Chí Minh",
          categories: updateData.categoriesV2 || ['others'],
        }
      }
    );

    if (!updatedEventDetail) {
      return res.status(404).json({ error: 'Event detail not found' });
    }

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.status(200).json({
      message: 'Event Detail updated successfully',
      body: updatedEventDetail
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const eventDetail = await EventDetail.findOne({ id: parseInt(id) });

    if (!eventDetail) {
      return res.status(404).json({ error: 'Event details not found' });
    }

    return res.status(200).json({
      message: 'Event retrieved successfully',
      body: eventDetail
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

exports.getAllEvents = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const limit = parseInt(req.query.limit) || 10; // Số lượng sự kiện mỗi trang
    const skip = (page - 1) * limit; // Số lượng bản ghi cần bỏ qua

    const events = await EventDetail
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ startTime: -1 });

    if (!events || events.length === 0) {
      return res.status(404).json({ error: 'No events found' });
    }

    return res.status(200).json({
      message: 'Events retrieved successfully',
      body: events
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

exports.getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const event = await Event.findOne({ url: slug.toLowerCase() });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventDetail = await EventDetail.findOne({ url: slug });

    if (!eventDetail) {
      return res.status(404).json({ error: 'Event details not found' });
    }

    return res.status(200).json({
      message: 'Event retrieved successfully',
      body: eventDetail
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}