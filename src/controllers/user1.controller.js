const Booking = require('../models/booking.model')

exports.getAllBooking = async (req, res) => {
  try {
    const userId = req.user.userId

    const myBookings = await Booking.find({ userId })

    if (!myBookings)
      return res.status(404).json({
        message: 'No booking available',
      })

    return res.status(200).json({
      message: 'Bookings retrieved successfully',
      body: myBookings,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal error' })
  }
}
