#!/usr/bin/env node --harmony
'use strict';
// http://www.fairmont.com/reservations/check-availability/
//

const moment = require('moment');
const Nightmare = require('nightmare');

const dates = [];

let index = 0;
while (index < 60) {
  dates.push(moment().add(index + 1, 'days').format('DD-MMM-YYYY'));
  index++;
}

index = 0;

const FAIRMONT = 'http://www.fairmont.com/reservations/check-availability/';
const HOTEL_SELECTOR = 'select[name="ctl00$ctl00$Content$Content$ddlDestination"]';
const HOTEL_OPTION_WHISTLER = '701';

const ARRIVAL_DATE_SELECTOR = '[name="ctl00$ctl00$Content$Content$txtArrivalDate"]';
const DEPART_DATE_SELECTOR = '[name="ctl00$ctl00$Content$Content$txtDepartureDate"]';
const BED_TYPE_SELECTOR = '[name="ctl00$ctl00$Content$Content$rptRoomDetails$ctl00$ddlBedTypes"]';
const BED_OPTION_ONE = '1';

const SUBMIT_BUTTON_SELECTOR = '[name="ctl00$ctl00$Content$FooterButton$btnCheckAvailability"]';

const CURRENCY_SELECTOR = '[name="ctl00$ctl00$Content$Content$ddlCurrencySelection"]';
const CURRENCY_OPTION_USD = 'USD';

function getPrice(index) {
  if (dates[index] && dates[index + 1]) {
    const nightmare = Nightmare({ show: true });

    nightmare
      .goto(FAIRMONT)

      // Select Whistler:
      .select(HOTEL_SELECTOR, HOTEL_OPTION_WHISTLER)
      .wait(1000)

      // Arrival Date:
      .evaluate((ARRIVAL_DATE_SELECTOR) => {
        document.querySelector(ARRIVAL_DATE_SELECTOR).removeAttribute('readonly')
      }, ARRIVAL_DATE_SELECTOR)
      .insert(ARRIVAL_DATE_SELECTOR)
      .insert(ARRIVAL_DATE_SELECTOR, dates[index])

      // Departure Date:
      .evaluate((DEPART_DATE_SELECTOR) => {
        document.querySelector(DEPART_DATE_SELECTOR).removeAttribute('readonly')
      }, DEPART_DATE_SELECTOR)
      .insert(DEPART_DATE_SELECTOR)
      .insert(DEPART_DATE_SELECTOR, dates[index + 1])

      // Bed:
      // .select(BED_TYPE_SELECTOR, BED_OPTION_ONE)

      .wait(1000)
      .click(SUBMIT_BUTTON_SELECTOR)

      // Wait for the page to load:
      .wait(() => /select-room/.test(location.href))

      .evaluate(() => {
        let link = null;
        let rate = '';

        document.querySelectorAll('a[href="#"]').forEach((a) => {
          if (/Daily Rate/.test(a.textContent)) {
            link = a;
            link.click()
          }
        });

        if (!link) return rate;

        wrapper = link.parentNode.parentNode.parentNode;
        wrapperId = wrapper.id;

        wrapper.querySelectorAll('.expandableRoomClass a[href="#"]').forEach((a) => {
          if (/Deluxe Slopeside View/.test(a.textContent)) {
            a.click();
            let roomWrapper = a.parentNode.parentNode.parentNode;

            rateWrapper = roomWrapper.querySelector('.rate');
            if (rateWrapper) {
              rate = rateWrapper.textContent.trim();
            }
          }
        });

        return rate;
      })
      .end()
      .then(function (result) {
        console.log(dates[index], result);
        index++;
        getPrice(index);
      })
      .catch(function (error) {
        console.error('Search failed:', error);
        index++;
        getPrice(index);
      });
  }
}

getPrice(0);
