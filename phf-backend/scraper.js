import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

// Function starts here
async function getFormulaOneDrivers() {
  try {
    const response = await fetch("https://www.formula1.com/en/drivers.html");
    const body = await response.text();
    const $ = cheerio.load(body);

    $('.listing-items--wrapper > .row > .col-12').map((index, element) => {
        const rank = $(element).find(".rank").text();
        const points = $(element).find(".points > .f1-wide--s").text();
        const team = $(element).find(".listing-item--team").text();
        const firstName = $(element).find(".listing-item--name span:first").text();
        const lastName = $(element).find(".listing-item--name span:last").text();
      
        console.log(team + ": " + firstName + " " + lastName + " Points: " + points);
    });
    
  } catch (error) {
    console.log(error);
  }
}

// Run getFormulaOneDrivers
getFormulaOneDrivers();