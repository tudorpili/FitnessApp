// backend/src/controllers/quoteController.js
const Quote = require('../models/Quote');

const quoteController = {
  /**
   * Handles GET request to fetch a random quote.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  getRandomQuote: async (req, res) => {
    try {
      // Optional: Check for a category query parameter if you implement getRandomByCategory
      // const { category } = req.query;
      // const quote = category ? await Quote.getRandomByCategory(category) : await Quote.getRandom();
      
      const quote = await Quote.getRandom();

      if (quote) {
        res.status(200).json(quote);
      } else {
        // This case should ideally not happen if there are quotes in the DB.
        // If it does, it means the quotes table is empty or RAND() failed unexpectedly.
        res.status(404).json({ message: 'No quotes found.' });
      }
    } catch (error) {
      console.error('Error in getRandomQuote controller:', error);
      res.status(500).json({ message: 'Error fetching random quote', error: error.message });
    }
  },

  /**
   * Optional: Handles POST request to add a new quote.
   * This would typically be an admin-protected route.
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  // addQuote: async (req, res) => {
  //   try {
  //     const { text, author, category } = req.body;
  //     if (!text) {
  //       return res.status(400).json({ message: 'Quote text is required.' });
  //     }
  //     const newQuote = await Quote.add({ text, author, category });
  //     if (newQuote) {
  //       res.status(201).json({ message: 'Quote added successfully!', quote: newQuote });
  //     } else {
  //       res.status(500).json({ message: 'Failed to add quote.' });
  //     }
  //   } catch (error) {
  //     console.error('Error in addQuote controller:', error);
  //     res.status(500).json({ message: 'Error adding quote', error: error.message });
  //   }
  // }
};

module.exports = quoteController;
