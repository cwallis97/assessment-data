const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const { CONNECTION_STRING } = process.env;

const sequelize = new Sequelize(CONNECTION_STRING);


const Country = sequelize.define('Country', {
  country_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const City = sequelize.define('City', {
  city_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});


Country.hasMany(City, { foreignKey: 'country_id' });
City.belongsTo(Country, { foreignKey: 'country_id' });

module.exports = {
  getCountries: async (req, res) => {
    try {
      const countries = await Country.findAll();
      res.status(200).json(countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  seed: async (req, res) => {
    try {
      await sequelize.sync({ force: true });
      const countriesData = [
        'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina',
        'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
        'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana',
        'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Côte d\'Ivoire', 'Cabo Verde', 'Cambodia',
        'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo',
        'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark',
        'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea',
        'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana',
        'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Holy See', 'Honduras', 'Hungary',
        'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan',
        'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
        'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali',
        'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia',
        'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
        'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau',
        'Palestine State', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
        'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
        'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone',
        'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan',
        'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand',
        'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda',
        'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 'Vanuatu',
        'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
      ];
      const countries = await Country.bulkCreate(countriesData.map(name => ({ name })));
      await City.bulkCreate([
        { name: 'City 1', rating: 5, country_id: countries[0].country_id },
        { name: 'City 2', rating: 4, country_id: countries[1].country_id },
        // Add more cities as needed
      ]);
      console.log('DB seeded!');
      res.sendStatus(200);
    } catch (err) {
      console.error('Error seeding DB', err);
      res.status(500).send('Internal Server Error');
    }
  },

  getCities: async (req, res) => {
    try {
      const cities = await City.findAll({
        include: [{ model: Country, attributes: ['country_id', 'name'] }],
      });
      res.status(200).json(cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  createCity: async (req, res) => {
    const { name, rating, countryId } = req.body;

    try {
      await City.create({ name, rating, country_id: countryId });
      console.log('City added successfully!');
      res.sendStatus(200);
    } catch (error) {
      console.error('Error adding city:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  deleteCity: async (req, res) => {
    const { id } = req.params;

    try {
      await City.destroy({ where: { city_id: id } });
      console.log('City deleted successfully!');
      res.sendStatus(200);
    } catch (error) {
      console.error('Error deleting city:', error);
      res.status(500).send('Internal Server Error');
    }
  },
};