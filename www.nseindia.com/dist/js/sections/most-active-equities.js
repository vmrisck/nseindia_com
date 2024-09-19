"use strict";

var mae_mainboard = void 0,
    mae_mainboard1 = void 0,
    mae_sme = void 0,
    mae_sme1 = void 0,
    mae_etf = void 0,
    mae_etf1 = void 0,
    mae_pricespurts = void 0,
    mae_pricespurts1 = void 0,
    mae_volumespurts = void 0,
    pbh_upper = void 0,
    pbh_lower = void 0,
    pbh_both = void 0,
    apiUrl = void 0;
var activeTabs = [];

B.on(document, 'allGood', function () {
    // loadTopGainerLoosers();

    /* Value convention Filters */
    $("#radio_mae_mainboard_val").on("change", "input", function () {
        var selVal = $("#radio_mae_mainboard_val").find("input:checked").val();
        convertToValue(selVal, mae_mainboard1);
    });
    /* Value convention Filters End */
    /* Value convention Filters */
    $("#radio_mae_mainboard_vol").on("change", "input", function () {
        var selVal = $("#radio_mae_mainboard_vol").find("input:checked").val();
        convertToValue(selVal, mae_mainboard);
    });
    /* Value convention Filters End */

    $('#top10_gainers_loser').on('click', function () {
        resetToCroresEquities('topGainerLoser');
    });

    $('#most_active_equities').on('click', function () {
        resetToCroresEquities('mae');
    });

    $('#mae_mainboard .currencytabs #volume').on('click', function () {
        resetToCroresEquities('maeVol');
    });

    $('#mae_mainboard .currencytabs #value_header').on('click', function () {
        resetToCroresEquities('maeVal');
    });
});
var loadTopGainerLoosersRef = function loadTopGainerLoosersRef() {
    try {

        $('#top10_gainlose #top10_gainlose_filter, #top10_gainlose #top10_gainlose_tabs').empty();
        $('#top10_gainlose #top10_gainlose_tabs').html(loader);
        Promise.all([B.get('/api/liveanalysis/gainers/allSec'), B.get('/api/liveanalysis/loosers/allSec')]).then(function (resp) {
            var allGainers = JSON.parse(resp[0]);
            var allLosers = JSON.parse(resp[1]);
            var glLengends = new Map(allGainers.legends);
            var indexes = Array.from(glLengends.keys());
            var colData = [{
                "name": "symbol",
                "heading": "Symbol",
                "subHead": "",
                "width": "11%",
                "sort": true,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false
            }, {
                "name": "open_price",
                "heading": "Open",
                "subHead": "",
                "width": "7%",
                "sort": false,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "number"
            }, {
                "name": "high_price",
                "heading": "High",
                "subHead": "",
                "width": "7%",
                "sort": false,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "number"
            }, {
                "name": "low_price",
                "heading": "Low",
                "subHead": "",
                "width": "8%",
                "sort": false,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "number"
            }, {
                "name": "prev_price",
                "heading": "Prev. Close",
                "subHead": "",
                "legend": "Previous Close",
                "width": "8%",
                "sort": false,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "number"
            }, {
                "name": "ltp",
                "legend": "Last Traded Price",
                "heading": "LTP",
                "subHead": "",
                "width": "8%",
                "sort": false,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "number"
            }, {
                "name": "net_price",
                "legend": "Percentage Change",
                "heading": "%chng",
                "subHead": "",
                "width": "7%",
                "sort": true,
                "chkVal": true,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": true,
                "format": "number"
            }, {
                "name": "trade_quantity",
                "heading": "Volume",
                "subHead": "(Shares)",
                "width": "11%",
                "sort": true,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "quantity"
            }, {
                "name": "turnover",
                "heading": "Value",
                "subHead": "(₹ Crores)",
                "valueTyp": "0.01",
                "valueFormat": "lakhs",
                "width": "10%",
                "sort": true,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "number"
            }, {
                "name": "ca_ex_dt",
                "heading": "CA ",
                "subHead": "",
                "width": "10%",
                "sort": false,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "date",
                "type": "date",
                "landing": "corporate-action"
            }];
            var gainers = customTable({
                tableStyle: { id: 'topgainer-Table', class: 'common_table customHeight-table tableScroll alt_row w-100' },
                colData: colData,
                rowData: []
            });
            var losers = customTable({
                tableStyle: { id: 'toplosers-Table', class: 'common_table customHeight-table tableScroll alt_row w-100' },
                colData: colData,
                rowData: []
            });

            var gainerValueConvention = customRadioBtnValConvention({
                radioGrpId: "top_gainer"
            });

            var loserValueConvention = customRadioBtnValConvention({
                radioGrpId: "top_loser"
            });

            var top10_gainlose_tabs = customTabs({
                tabStyle: {},
                tabContentStyle: 'mt-3',
                tabs: [{
                    title: 'GAINERS',
                    key: 'gainers',
                    body: function body() {
                        return div({ id: 'topGainerTable', class: 'table-wrap mb-2 borderSet maxHeight-480 scrollWrap' }, div({ id: 'topLosersTable', class: 'customTable-widthCorp tableWidth-850 ' }, gainerValueConvention, gainers));
                    }
                }, {
                    title: 'LOSERS',
                    key: 'losers',
                    body: function body() {
                        return div({ class: 'table-wrap mb-2 borderSet maxHeight-480 scrollWrap' }, div({ class: 'customTable-widthCorp tableWidth-850' }, loserValueConvention, losers));
                    }
                }]
            });

            var filterPanel = customFilterPanel({
                filters: [{
                    name: 'index',
                    label: 'Select Index',
                    type: 'select',
                    default: indexes[6],
                    dataType: 'string',
                    column: 'col-md-4',
                    options: glLengends //get unique values
                }],
                showClear: false,
                onFilter: function onFilter(conditions) {
                    if (conditions.index) {
                        gainers.state.rowData = allGainers[0].data.data && allGainers[0].data.data.length > 0 ? allGainers[0].data.data.slice(0, 10) : [];
                        losers.state.rowData = allLosers[conditions.index].data && allLosers[conditions.index].data.length > 0 ? allLosers[conditions.index].data.slice(0, 10) : [];
                        // B.findOne('#tabletopganer').innerText = "As on " + allGainers[conditions.index].timestamp + " IST";

                        // B.findOne('#top10_gainlose .asondate span').innerText = allGainers[conditions.index].timestamp || 'No Date';
                    } else {
                        gainers.state.rowData = [];
                    }
                }
            });
            filterPanel.state.selected = { index: indexes[6] };
            gainers.state.rowData = allGainers.gainers.data && allGainers.gainers.data.length > 0 ? allGainers.gainers.data.slice(0, 10) : [];
            losers.state.rowData = allLosers.loosers.data && allLosers.loosers.data.length > 0 ? allLosers.loosers.data.slice(0, 10) : [];
            B.findOne('#tabletopgainer').innerHTML = "<span id=\"asontxt\"> As on </span> <span> " + allGainers.gainers.timestamp + " </span> IST";
            activeTabs["loadTopGainer"] = true;

            // gainers.state.rowData = allGainers[indexes[0]].data;
            // losers.state.rowData = allLosers[indexes[0]].data;
            // B.findOne('#top10_gainlose .asondate span').innerText = "As on " + allGainers[indexes[6]].timestamp + " IST";

            // B.findOne('#top10_gainlose .asondate span').innerText = allGainers.gainers.timestamp || 'No Date';
            $('#top10_gainlose #top10_gainlose_tabs').empty();
            B.render(filterPanel, B.findOne('#top10_gainlose #top10_gainlose_filter'));
            B.render(top10_gainlose_tabs, B.findOne('#top10_gainlose #top10_gainlose_tabs'));

            addValueConventionOption(gainers, losers);
            converToCroreEquities([gainers, losers]);
            resetToCroresEquities("topGainerLoser");

            // tableHeaderFix();
            var nsetranslateEvent = new CustomEvent('element_render_end_custom_event');
            document.dispatchEvent(nsetranslateEvent);
        });
    } catch (e) {
        console.log(e.message);
    }
    var nsetranslateEvent = new CustomEvent('element_render_end_custom_event');
    document.dispatchEvent(nsetranslateEvent);
};
// this is used to load top 10 gainers
var loadTopGainerLoosers = function loadTopGainerLoosers() {
    try {
        if (activeTabs["loadTopGainer"] && activeTabs["loadTopGainer"] === true) {
            return;
        } else {
            $('#top10_gainlose #top10_gainlose_filter, #top10_gainlose #top10_gainlose_tabs').empty();
            $('#top10_gainlose #top10_gainlose_tabs').html(loader);
            Promise.all([B.get('/api/liveanalysis/gainers/allSec'), B.get('/api/liveanalysis/loosers/allSec')]).then(function (resp) {
                var allGainers = JSON.parse(resp[0]);
                var allLosers = JSON.parse(resp[1]);
                var glLengends = new Map(allGainers.legends);
                var indexes = Array.from(glLengends.keys());
                var colData = [{
                    "name": "symbol",
                    "heading": "Symbol",
                    "subHead": "",
                    "width": "11%",
                    "sort": true,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false
                }, {
                    "name": "open_price",
                    "heading": "Open",
                    "subHead": "",
                    "width": "7%",
                    "sort": false,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "number"
                }, {
                    "name": "high_price",
                    "heading": "High",
                    "subHead": "",
                    "width": "7%",
                    "sort": false,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "number"
                }, {
                    "name": "low_price",
                    "heading": "Low",
                    "subHead": "",
                    "width": "8%",
                    "sort": false,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "number"
                }, {
                    "name": "prev_price",
                    "heading": "Prev. Close",
                    "subHead": "",
                    "legend": "Previous Close",
                    "width": "8%",
                    "sort": false,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "number"
                }, {
                    "name": "ltp",
                    "legend": "Last Traded Price",
                    "heading": "LTP",
                    "subHead": "",
                    "width": "8%",
                    "sort": false,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "number"
                }, {
                    "name": "net_price",
                    "legend": "Percentage Change",
                    "heading": "%chng",
                    "subHead": "",
                    "width": "7%",
                    "sort": true,
                    "chkVal": true,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": true,
                    "format": "number"
                }, {
                    "name": "trade_quantity",
                    "heading": "Volume",
                    "subHead": "(Shares)",
                    "width": "11%",
                    "sort": true,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "quantity"
                }, {
                    "name": "turnover",
                    "heading": "Value",
                    "subHead": "(₹ Crores)",
                    "valueTyp": "0.01",
                    "valueFormat": "lakhs",
                    "width": "10%",
                    "sort": true,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "number"
                }, {
                    "name": "ca_ex_dt",
                    "heading": "CA ",
                    "subHead": "",
                    "width": "10%",
                    "sort": false,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "date",
                    "type": "date",
                    "landing": "corporate-action"
                }];
                var gainers = customTable({
                    tableStyle: { id: 'topgainer-Table', class: 'common_table customHeight-table tableScroll alt_row w-100' },
                    colData: colData,
                    rowData: []
                });
                var losers = customTable({
                    tableStyle: { id: 'toplosers-Table', class: 'common_table customHeight-table tableScroll alt_row w-100' },
                    colData: colData,
                    rowData: []
                });

                var gainerValueConvention = customRadioBtnValConvention({
                    radioGrpId: "top_gainer"
                });

                var loserValueConvention = customRadioBtnValConvention({
                    radioGrpId: "top_loser"
                });

                var top10_gainlose_tabs = customTabs({
                    tabStyle: {},
                    tabContentStyle: 'mt-3',
                    tabs: [{
                        title: 'GAINERS',
                        key: 'gainers',
                        body: function body() {
                            return div({ id: 'topGainerTable', class: 'table-wrap mb-2 borderSet maxHeight-480 scrollWrap' }, div({ id: 'topLosersTable', class: 'customTable-widthCorp tableWidth-850 ' }, gainerValueConvention, gainers));
                        }
                    }, {
                        title: 'LOSERS',
                        key: 'losers',
                        body: function body() {
                            return div({ class: 'table-wrap mb-2 borderSet maxHeight-480 scrollWrap' }, div({ class: 'customTable-widthCorp tableWidth-850' }, loserValueConvention, losers));
                        }
                    }]
                });

                var filterPanel = customFilterPanel({
                    filters: [{
                        name: 'index',
                        label: 'Select Index',
                        type: 'select',
                        default: indexes[6],
                        dataType: 'string',
                        column: 'col-md-4',
                        options: glLengends //get unique values
                    }],
                    showClear: false,
                    onFilter: function onFilter(conditions) {
                        if (conditions.index) {
                            gainers.state.rowData = allGainers[0].data.data && allGainers[0].data.data.length > 0 ? allGainers[0].data.data.slice(0, 10) : [];
                            losers.state.rowData = allLosers[conditions.index].data && allLosers[conditions.index].data.length > 0 ? allLosers[conditions.index].data.slice(0, 10) : [];
                            // B.findOne('#tabletopganer').innerText = "As on " + allGainers[conditions.index].timestamp + " IST";

                            // B.findOne('#top10_gainlose .asondate span').innerText = allGainers[conditions.index].timestamp || 'No Date';
                        } else {
                            gainers.state.rowData = [];
                        }
                    }
                });
                filterPanel.state.selected = { index: indexes[6] };
                gainers.state.rowData = allGainers.gainers.data && allGainers.gainers.data.length > 0 ? allGainers.gainers.data.slice(0, 10) : [];
                losers.state.rowData = allLosers.loosers.data && allLosers.loosers.data.length > 0 ? allLosers.loosers.data.slice(0, 10) : [];
                B.findOne('#tabletopgainer').innerHTML = "<span id=\"asontxt\"> As on </span> <span> " + allGainers.gainers.timestamp + " </span> IST";
                activeTabs["loadTopGainer"] = true;

                // gainers.state.rowData = allGainers[indexes[0]].data;
                // losers.state.rowData = allLosers[indexes[0]].data;
                // B.findOne('#top10_gainlose .asondate span').innerText = "As on " + allGainers[indexes[6]].timestamp + " IST";

                // B.findOne('#top10_gainlose .asondate span').innerText = allGainers.gainers.timestamp || 'No Date';
                $('#top10_gainlose #top10_gainlose_tabs').empty();
                B.render(filterPanel, B.findOne('#top10_gainlose #top10_gainlose_filter'));
                B.render(top10_gainlose_tabs, B.findOne('#top10_gainlose #top10_gainlose_tabs'));

                addValueConventionOption(gainers, losers);
                converToCroreEquities([gainers, losers]);
                resetToCroresEquities("topGainerLoser");

                var nsetranslateEvent = new CustomEvent('element_render_end_custom_event');
                document.dispatchEvent(nsetranslateEvent);
                // tableHeaderFix();
            });
        }
    } catch (e) {
        console.log(e.message);
    }
};

// this is used to load equities volumn tab
function loadEquitiesVolume(param) {
    try {
        if (activeTabs["loadEquitiesVolume"] && activeTabs["loadEquitiesVolume"] === true) {
            return;
        } else {
            $('#mae_mainboard_vol', '#tableDerivativeVal').empty();
            mae_mainboard = customTable({
                tableStyle: { id: 'mae_mainboard_tableC', class: 'common_table customHeight-table tableScroll alt_row w-100' },
                colData: [{
                    "name": "symbol",
                    "heading": "Symbol",
                    "subHead": "",
                    "width": "10%",
                    "sort": true,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false
                }, {
                    "name": "open",
                    "heading": "Open",
                    "subHead": "",
                    "width": "8%",
                    "sort": false,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "number"
                }, {
                    "name": "dayHigh",
                    "heading": "High",
                    "subHead": "",
                    "width": "7%",
                    "sort": false,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "number"
                }, {
                    "name": "dayLow",
                    "heading": "Low",
                    "subHead": "",
                    "width": "7%",
                    "sort": false,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "number"
                }, {
                    "name": "previousClose",
                    "heading": "Prev. Close",
                    "subHead": "",
                    "legend": "Previous Day Closing Price",
                    "width": "8%",
                    "sort": false,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "number"
                }, {
                    "name": "lastPrice",
                    "legend": "Last Traded Price",
                    "heading": "LTP",
                    "subHead": "",
                    "width": "8%",
                    "sort": false,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "number"
                }, {
                    "name": "pChange",
                    "legend": "Percentage Change",
                    "heading": "%Chng",
                    "subHead": "",
                    "width": "7%",
                    "sort": true,
                    "chkVal": true,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "number"
                }, {
                    "name": "totalTradedVolume",
                    "heading": "Volume",
                    "subHead": "(Shares)",
                    "width": "11%",
                    "sort": false,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "quantity"
                }, {
                    "name": "totalTradedValue",
                    "heading": "Value",
                    "subHead": "(₹ Crores)",
                    "valueTyp": "10000000",
                    "width": "10%",
                    "sort": false,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "number"
                }, {
                    "name": "exDate",
                    "heading": "CA",
                    "subHead": "",
                    "width": "10%",
                    "sort": false,
                    "chkVal": false,
                    "chkHigh": false,
                    "chkLow": false,
                    "indicator": false,
                    "sortHighLow": false,
                    "format": "date",
                    "type": "date",
                    "landing": "corporate-action"
                }],
                rowData: []
            });

            B.render(mae_mainboard, B.findOne('#mae_mainboard_vol'));
            B.findOne("#mae_mainboard_tableC .emptyRow").innerHTML = loader;
            B.get('/api/live-analysis-most-active-securities?index=' + param + "&limit=10").then(function (resp) {
                var respJSON = JSON.parse(resp);
                mae_mainboard.state.rowData = respJSON.data || [];
                converToCroreEquities([mae_mainboard]);
                resetToCroresEquities("maeVol");

                B.findOne('#tableActiveEqutiesTime').innerHTML = "<span id=\"asontxt\"> As on </span> <span> " + respJSON.timestamp + " </span> IST";
                activeTabs["loadEquitiesVolume"] = true;
            });
        }
    } catch (e) {
        console.log(e.message);
    }
    var nsetranslateEvent = new CustomEvent('element_render_end_custom_event');
    document.dispatchEvent(nsetranslateEvent);
}

// this is used to load equities value tab
function loadEquitiesValue(param) {
    try {
        if (activeTabs["loadEquitiesValue"] && activeTabs["loadEquitiesValue"] === true) {
            return;
        }
        $('#mae_mainboard_val', '#tableDerivativeVal').empty();
        mae_mainboard1 = customTable({
            tableStyle: { id: 'mae_mainboard_tableC1', class: 'common_table customHeight-table tableScroll alt_row w-100' },
            colData: [{
                "name": "symbol",
                "heading": "Symbol",
                "subHead": "",
                "width": "10%",
                "sort": true,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false
            }, {
                "name": "open",
                "heading": "Open",
                "subHead": "",
                "width": "8%",
                "sort": false,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "number"
            }, {
                "name": "dayHigh",
                "heading": "High",
                "subHead": "",
                "width": "7%",
                "sort": false,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "number"
            }, {
                "name": "dayLow",
                "heading": "Low",
                "subHead": "",
                "width": "7%",
                "sort": false,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "number"
            }, {
                "name": "previousClose",
                "heading": "Prev. Close",
                "subHead": "",
                "legend": "Previous Day Closing Price",
                "width": "8%",
                "sort": false,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "number"
            }, {
                "name": "lastPrice",
                "legend": "Last Traded Price",
                "heading": "LTP",
                "subHead": "",
                "width": "8%",
                "sort": false,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "number"
            }, {
                "name": "pChange",
                "legend": "Percentage Change",
                "heading": "%Chng",
                "subHead": "",
                "width": "7%",
                "sort": true,
                "chkVal": true,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "number"
            }, {
                "name": "totalTradedVolume",
                "heading": "Volume",
                "subHead": "(Shares)",
                "width": "11%",
                "sort": false,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "quantity"
            }, {
                "name": "totalTradedValue",
                "heading": "Value",
                "subHead": "(₹ Crores)",
                "valueTyp": "10000000",
                "width": "10%",
                "sort": false,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "number"
            }, {
                "name": "exDate",
                "heading": "CA",
                "subHead": "",
                "width": "10%",
                "sort": false,
                "chkVal": false,
                "chkHigh": false,
                "chkLow": false,
                "indicator": false,
                "sortHighLow": false,
                "format": "date",
                "type": "date",
                "landing": "corporate-action"
            }],
            rowData: []
        });
        B.render(mae_mainboard1, B.findOne('#mae_mainboard_val'));
        B.findOne("#mae_mainboard_tableC1 .emptyRow").innerHTML = loader;

        B.get('/api/live-analysis-most-active-securities?index=' + param + "&limit=10").then(function (resp) {
            var respJSON = JSON.parse(resp);
            mae_mainboard1.state.rowData = respJSON.data || [];
            // equityDerivativeVal.state.rowData = respJSON.value || [];

            converToCroreEquities([mae_mainboard1]);
            resetToCroresEquities('maeVal');

            B.findOne('#tableActiveEqutiesTime1').innerHTML = "<span id=\"asontxt\"> As on </span> <span> " + respJSON.timestamp + " </span> IST";
            activeTabs["loadEquitiesValue"] = true;
        });
    } catch (e) {
        console.log(e.message);
    }
    var nsetranslateEvent = new CustomEvent('element_render_end_custom_event');
    document.dispatchEvent(nsetranslateEvent);
}

// this is used to load equities value tab on click of refresh
var initMAEquitiesVal = function initMAEquitiesVal() {
    try {
        var url = '',
            param = '',
            name = '',
            variableName = '',
            id = '';
        variableName = 'mae_mainboard1';
        id = 'mae_mainboard_tableC1';
        url = '/api/live-analysis-most-active-securities?index=value&limit=10';

        window[variableName].state.rowData = [];
        // if(B.findOne("#" + id + " .emptyRow")) {
        B.findOne("#" + id + " .emptyRow").innerHTML = loader;
        // }
        B.get("api/live-analysis-most-active-securities?index=value&limit=10").then(function (resp) {
            var respJSON = JSON.parse(resp);
            B.findOne('#tableActiveEqutiesTime1').innerHTML = "<span id=\"asontxt\"> As on </span> <span> " + respJSON.timestamp + " </span> IST";

            // B.findOne('#ma_equities .asondate span').innerText = respJSON.timestamp || 'No Date';
            window[variableName].state.rowData = respJSON.data;
            converToCroreEquities([mae_mainboard1]);
            resetToCroresEquities('maeVal');
        });
    } catch (e) {
        console.log(e.message);
    }
};

// this is used to load equities volumn tab on click of refresh
var initMAEquitiesVol = function initMAEquitiesVol() {
    var url = '',
        param = '',
        name = '',
        variableName = '',
        id = '';
    variableName = 'mae_mainboard';
    id = 'mae_mainboard_tableC';
    url = '/api/live-analysis-most-active-securities?index=' + param + "&limit=10";

    window[variableName].state.rowData = [];
    // if(B.findOne("#" + id + " .emptyRow")) {
    B.findOne("#" + id + " .emptyRow").innerHTML = loader;
    // }
    B.get("api/live-analysis-most-active-securities?index=volume&limit=10").then(function (resp) {
        var respJSON = JSON.parse(resp);
        B.findOne('#tableActiveEqutiesTime').innerHTML = "<span id=\"asontxt\"> As on </span> <span> " + respJSON.timestamp + " </span> IST";

        // B.findOne('#ma_equities .asondate span').innerText = respJSON.timestamp || 'No Date';
        window[variableName].state.rowData = respJSON.data;

        converToCroreEquities([mae_mainboard]);
        resetToCroresEquities('maeVol');
    });
};

var addValueConventionOption = function addValueConventionOption(gainers, losers) {
    /* Value convention Filters */
    $("#radio_top_gainer").on("change", "input", function () {
        var selVal = $("#radio_top_gainer").find("input:checked").val();
        convertToValue(selVal, gainers);
    });
    /* Value convention Filters End */
    /* Value convention Filters */
    $("#radio_top_loser").on("change", "input", function () {
        var selVal = $("#radio_top_loser").find("input:checked").val();
        convertToValue(selVal, losers);
    });
    /* Value convention Filters End */

    $('#top10_gainlose_tabs #GAINERS').on('click', function () {
        resetToCroresEquities('topGainer');
        // resetToCroresByChangingTabs("gainers")
    });

    $('#top10_gainlose_tabs #LOSERS').on('click', function () {
        resetToCroresEquities('topLoser');
        // resetToCroresByChangingTabs("losers")
    });
};

function converToCroreEquities(tables) {
    tables.forEach(function (t) {
        convertToValue("crores", t);
    });
}

function resetToCroresByChangingTabs(tab) {
    $("#" + tab + " input[type=\"radio\"][value=crores]").click();
}

function resetToCroresEquities(name) {
    try {
        switch (name) {
            case "topGainerLoser":
                resetToCroresByChangingTabs('radio_top_gainer');
                resetToCroresByChangingTabs('radio_top_loser');
                break;
            case "mae":
                resetToCroresByChangingTabs('radio_mae_mainboard_vol');
                resetToCroresByChangingTabs('radio_mae_mainboard_val');
                break;
            case "topGainer":
                resetToCroresByChangingTabs('radio_top_gainer');
                break;
            case "topLoser":
                resetToCroresByChangingTabs('radio_top_loser');
                break;
            case "maeVol":
                resetToCroresByChangingTabs('radio_mae_mainboard_vol');
                break;
            case "maeVal":
                resetToCroresByChangingTabs('radio_mae_mainboard_val');
                break;
        }
    } catch (e) {
        console.log(e);
    }
}

// $('#priceSprutSelect select').change(function () {
//     const secVal = $(this).val();

//     mae_pricespurts.state.rowData = [];
//     B.findOne("#mae_pricespurts_tableC .emptyRow").innerHTML = loader;

//     B.get(`/api/live-analysis-variations?index=gainers&key=${secVal}&limit=10`).then((resp) => {
//         let respJSON = JSON.parse(resp);
//         // B.findOne('#ma_equities .asondate span').innerText = respJSON.timestamp || 'No Date';
//         mae_pricespurts.state.rowData = respJSON.data;
//     });
// });

// const downloadCSVFile = (type) => {
//     try{
//         let csvUrl, name, param;
//         switch (type) {
//             case 'MainBoard':
//                 name = 'mae_mainboard_radio_group';
//                 param = $('[name="'+ name +'"]:checked').val();
//                 csvUrl = `/api/live-analysis-most-active-securities?index=${param}&csv=true`;
//                 break;
//             case 'SME':
//                 name = 'mae_sme_radio_group';
//                 param = $('[name="'+ name +'"]:checked').val();
//                 csvUrl = `/api/live-analysis-most-active-sme-csv?index=${param}&csv=true`;
//                 break;
//             case 'ETF':
//                 name = 'mae_etf_radio_group';
//                 param = $('[name="'+ name +'"]:checked').val();
//                 csvUrl = `/api/live-analysis-most-active-etf-csv?index=${param}&csv=true`;
//                 break;
//             case 'PriceSpurts':
//                 let activeLov = $('#priceSprutSelect').find('select option:selected').val();
//                 csvUrl = `/api/live-analysis-variations?index=gainers&key=${activeLov}&type=mae&csv=true`;
//                 break;
//             case 'VolumeSpurts':
//                 csvUrl = '/api/live-analysis-volume-gainers?csv=true';
//                 break;
//         }

//         window.open(
//             csvUrl, '_blank'
//         );
//     }catch (e) {
//         console.log(e)
//     }
// }

// function loadSMEVolume(param){
//     try{
//         if (activeTabs["loadSMEVolume"] && activeTabs["loadSMEVolume"] === true) {
//             return;
//           }
//     $('#mae_sme_vol', '#tableSMETime').empty();
//     mae_sme = customTable({
//         tableStyle : {id : 'mae_sme_tableC', class :'common_table customHeight-table tableScroll alt_row w-100'},
//         colData : [
//             {
//                 "name": "symbol",
//                 "heading": "Symbol",
//                 "subHead": "",
//                 "width": "16%",
//                 "sort": true,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false
//             },
//             {
//                 "name": "open",
//                 "heading": "Open",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "dayHigh",
//                 "heading": "High",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "dayLow",
//                 "heading": "Low",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "previousClose",
//                 "legend": "Previous Day Closing Price",
//                 "heading": "Prev. Close",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "lastPrice",
//                 "legend": "Last Traded Price",
//                 "heading": "LTP",
//                 "subHead": "",
//                 "width": "8%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "pChange",
//                 "legend": "Percentage Change",
//                 "heading": "%CHNG",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": true,
//                 "chkVal": true,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "totalTradedVolume",
//                 "heading": "Volume",
//                 "subHead": "(Shares)",
//                 "width": "13%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "quantity"
//             },
//             {
//                 "name": "totalTradedValue",
//                 "heading": "Value",
//                 "subHead": "(₹ Lakhs)",
//                 "width": "13%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//         ],
//         rowData : []
//     })
//     B.render(mae_sme, B.findOne('#mae_sme_vol'));
//     B.findOne("#mae_sme_tableC .emptyRow").innerHTML = loader;
//     B.get('/api/live-analysis-most-active-sme?index=' + param + "&limit=10").then((resp) => {
//         let respJSON = JSON.parse(resp);
//         mae_sme.state.rowData = respJSON.data || [];

//         B.findOne('#tableSMETime').innerText = "As on " + respJSON.timestamp + " IST";
//         activeTabs["loadSMEVolume"] = true;

//     });
// }
// catch(e){
//     console.log(e.message)
// }
// }
// function loadSMEValue(param){
//     try{
//         if (activeTabs["loadSMEValue"] && activeTabs["loadSMEValue"] === true) {
//             return;
//           }
//     $('#mae_sme_val', '#tableSMETime').empty();

//     mae_sme1 = customTable({
//         tableStyle : {id : 'mae_sme_tableC1', class :'common_table customHeight-table tableScroll alt_row w-100'},
//         colData : [
//             {
//                 "name": "symbol",
//                 "heading": "Symbol",
//                 "subHead": "",
//                 "width": "16%",
//                 "sort": true,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false
//             },
//             {
//                 "name": "open",
//                 "heading": "Open",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "dayHigh",
//                 "heading": "High",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "dayLow",
//                 "heading": "Low",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "previousClose",
//                 "legend": "Previous Day Closing Price",
//                 "heading": "Prev. Close",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "lastPrice",
//                 "legend": "Last Traded Price",
//                 "heading": "LTP",
//                 "subHead": "",
//                 "width": "8%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "pChange",
//                 "legend": "Percentage Change",
//                 "heading": "%CHNG",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": true,
//                 "chkVal": true,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "totalTradedVolume",
//                 "heading": "Volume",
//                 "subHead": "(Shares)",
//                 "width": "13%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "quantity"
//             },
//             {
//                 "name": "totalTradedValue",
//                 "heading": "Value",
//                 "subHead": "(₹ Lakhs)",
//                 "width": "13%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//         ],
//         rowData : []
//     })
//     B.render(mae_sme1, B.findOne('#mae_sme_val'));
//     B.findOne("#mae_sme_tableC1 .emptyRow").innerHTML = loader;
//     B.get('/api/live-analysis-most-active-sme?index=' + param + "&limit=10").then((resp) => {
//         let respJSON = JSON.parse(resp);
//         mae_sme1.state.rowData = respJSON.data || [];
//         B.findOne('#tableSMETime').innerText = "As on " + respJSON.timestamp + " IST";
//         activeTabs["loadSMEValue"] = true;

//     });
// }catch(e){
//     console.log(e.message)
// }
// }
// function loadETFVolume(param){
//     try{

//         if (activeTabs["loadETFVolume"] && activeTabs["loadETFVolume"] === true) {
//             return;
//           }
//     $('#mae_etf_vol', '#tableETFTime').empty();
//     mae_etf = customTable({
//         tableStyle : {id : 'mae_etf_tableC', class :'common_table customHeight-table tableScroll alt_row w-100'},
//         colData : [
//             {
//                 "name": "symbol",
//                 "heading": "Symbol",
//                 "subHead": "",
//                 "width": "15%",
//                 "sort": true,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false
//             },
//             {
//                 "name": "open",
//                 "heading": "Open",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "dayHigh",
//                 "heading": "High",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "dayLow",
//                 "heading": "Low",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "lastPrice",
//                 "legend": "Last Traded Price",
//                 "heading": "LTP",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "nav",
//                 "heading": "Nav",
//                 "legend": "Net Assest Value",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "pChange",
//                 "legend": "Percentage Change",
//                 "heading": "%CHNG",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": true,
//                 "chkVal": true,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "totalTradedVolume",
//                 "heading": "Volume",
//                 "subHead": "(Shares)",
//                 "width": "12%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "quantity"
//             },
//             {
//                 "name": "totalTradedValue",
//                 "heading": "Value",
//                 "subHead": "(₹ Lakhs)",
//                 "width": "13%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//         ],
//         rowData : []
//     })
//      B.render(mae_etf, B.findOne('#mae_etf_vol'));
//     B.findOne("#mae_etf_tableC .emptyRow").innerHTML = loader;
//     B.get('/api/live-analysis-most-active-etf?index=' + param + "&limit=10").then((resp) => {
//         let respJSON = JSON.parse(resp);
//         mae_etf.state.rowData = respJSON.data || [];
//         B.findOne('#tableETFTime').innerText = "As on " + respJSON.timestamp + " IST";
//         activeTabs["loadETFVolume"] = true;

//     });
// }catch(e){
//     console.log(e.message)
// }
// }
// function loadETFValue(param){
//     try{

//         if (activeTabs["loadETFValue"] && activeTabs["loadETFValue"] === true) {
//             return;
//           }
//     $('#mae_etf_val', '#tableETFTime').empty();

//     mae_etf1 = customTable({
//         tableStyle : {id : 'mae_etf_tableC1', class :'common_table customHeight-table tableScroll alt_row w-100'},
//         colData : [
//             {
//                 "name": "symbol",
//                 "heading": "Symbol",
//                 "subHead": "",
//                 "width": "15%",
//                 "sort": true,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false
//             },
//             {
//                 "name": "open",
//                 "heading": "Open",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "dayHigh",
//                 "heading": "High",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "dayLow",
//                 "heading": "Low",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "lastPrice",
//                 "legend": "Last Traded Price",
//                 "heading": "LTP",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "nav",
//                 "heading": "Nav",
//                 "legend": "Net Assest Value",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "pChange",
//                 "legend": "Percentage Change",
//                 "heading": "%CHNG",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": true,
//                 "chkVal": true,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "totalTradedVolume",
//                 "heading": "Volume",
//                 "subHead": "(Shares)",
//                 "width": "12%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "quantity"
//             },
//             {
//                 "name": "totalTradedValue",
//                 "heading": "Value",
//                 "subHead": "(₹ Lakhs)",
//                 "width": "13%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//         ],
//         rowData : []
//     })
//     B.render(mae_etf1, B.findOne('#mae_etf_val'));
//     B.findOne("#mae_etf_tableC1 .emptyRow").innerHTML = loader;
//     B.get('/api/live-analysis-most-active-etf?index=' + param + "&limit=10").then((resp) => {
//         let respJSON = JSON.parse(resp);
//         mae_etf1.state.rowData = respJSON.data || [];
//         B.findOne('#tableETFTime').innerText = "As on " + respJSON.timestamp + " IST";
//         activeTabs["loadETFValue"] = true;

//     });
// }catch(e){
//     console.log(e.message)
// }
// }
// function loadSME(){
//     loadSMEVolume("volume")
//     loadSMEValue("value")
// }
// function ETFs(){
//     loadETFVolume("volume")
//     loadETFValue("value")

// }
function MostActive() {
    loadEquitiesVolume("volume");
    loadEquitiesValue("value");
}
// function loadPricespurtsVolume(){
//     try{

//         if (activeTabs["loadPricespurtsVolume"] && activeTabs["loadPricespurtsVolume"] === true) {
//             return;
//           }
//     $('#mae_pricespurts_table', '#tableETFTime').empty();
//     mae_pricespurts = customTable({
//         tableStyle : {id : 'mae_pricespurts_tableC', class :'common_table customHeight-table tableScroll alt_row w-100'},
//         colData : [
//             {
//                 "name": "symbol",
//                 "heading": "Symbol",
//                 "subHead": "",
//                 "width": "35%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false
//             },
//             {
//                 "name": "series",
//                 "heading": "Series",
//                 "subHead": "",
//                 "width": "15%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//             },
//             {
//                 "name": "ltp",
//                 "legend": "Last Traded Price",
//                 "heading": "LTP",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "net_price",
//                 "legend": "Percentage Change",
//                 "heading": "%CHNG",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": true,
//                 "chkVal": true,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "trade_quantity",
//                 "heading": "Volume",
//                 "subHead": "(Shares)",
//                 "width": "15%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "quantity"
//             },
//             {
//                 "name": "turnover",
//                 "heading": "Value",
//                 "subHead": "(₹ Lakhs)",
//                 "width": "15%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             }
//         ],
//         rowData : []
//     })
//      B.render(mae_pricespurts, B.findOne('#mae_pricespurts_table'));
//     B.findOne("#mae_pricespurts_tableC .emptyRow").innerHTML = loader;
//     B.get('/api/live-analysis-variations?index=gainers&key=SecGtr20&limit=10').then((resp) => {
//         let respJSON = JSON.parse(resp);
//         mae_pricespurts.state.rowData = respJSON.data || [];
//         B.findOne('#tablePricespurtsTime').innerText = "As on " + respJSON.timestamp + " IST";
//         activeTabs["loadPricespurtsVolume"] = true;

//     });
// }catch(e){
//     console.log(e.message)
// }
// }
// function loadPricespurtsValue(param){
//     try{

//         if (activeTabs["loadPricespurtsValue"] && activeTabs["loadPricespurtsValue"] === true) {
//             return;
//           }
//     $('#mae_pricespurts_val', '#tablePricespurtsTime').empty();

//     mae_pricespurts1 = customTable({
//         tableStyle : {id : 'mae_pricespurts_tableC1', class :'common_table customHeight-table tableScroll alt_row w-100'},
//         colData : [
//             {
//                 "name": "symbol",
//                 "heading": "Symbol",
//                 "subHead": "",
//                 "width": "15%",
//                 "sort": true,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false
//             },
//             {
//                 "name": "open",
//                 "heading": "Open",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "dayHigh",
//                 "heading": "High",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "dayLow",
//                 "heading": "Low",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "lastPrice",
//                 "legend": "Last Traded Price",
//                 "heading": "LTP",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "nav",
//                 "heading": "Nav",
//                 "legend": "Net Assest Value",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "pChange",
//                 "legend": "Percentage Change",
//                 "heading": "%CHNG",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": true,
//                 "chkVal": true,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "totalTradedVolume",
//                 "heading": "Volume",
//                 "subHead": "(Shares)",
//                 "width": "12%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "quantity"
//             },
//             {
//                 "name": "totalTradedValue",
//                 "heading": "Value",
//                 "subHead": "(₹ Lakhs)",
//                 "width": "13%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//         ],
//         rowData : []
//     })
//     B.render(mae_pricespurts1, B.findOne('#mae_pricespurts_val'));
//     B.findOne("#mae_pricespurts_tableC1 .emptyRow").innerHTML = loader;
//     B.get('/api/live-analysis-most-active-etf?index=' + param + "&limit=10").then((resp) => {
//         let respJSON = JSON.parse(resp);
//         mae_pricespurts1.state.rowData = respJSON.data || [];
//         B.findOne('#tablePricespurtsTime').innerText = "As on " + respJSON.timestamp + " IST";
//         activeTabs["loadPricespurtsValue"] = true;

//     });
// }catch(e){
//     console.log(e.message)
// }
// }
// function priceSpurts(){
//     loadPricespurtsVolume()
//     loadPricespurtsValue("value")
//     if (activeTabs["priceSpurts"] && activeTabs["priceSpurts"] === true) {
//         return;
//       }
//   mae_pricespurts = customTable({
//         tableStyle : {id : 'mae_pricespurts_tableC', class :'common_table customHeight-table tableScroll alt_row w-100'},
//         colData : [
//             {
//                 "name": "symbol",
//                 "heading": "Symbol",
//                 "subHead": "",
//                 "width": "35%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false
//             },
//             {
//                 "name": "series",
//                 "heading": "Series",
//                 "subHead": "",
//                 "width": "15%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//             },
//             {
//                 "name": "ltp",
//                 "legend": "Last Traded Price",
//                 "heading": "LTP",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "net_price",
//                 "legend": "Percentage Change",
//                 "heading": "%CHNG",
//                 "subHead": "",
//                 "width": "10%",
//                 "sort": true,
//                 "chkVal": true,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             },
//             {
//                 "name": "trade_quantity",
//                 "heading": "Volume",
//                 "subHead": "(Shares)",
//                 "width": "15%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "quantity"
//             },
//             {
//                 "name": "turnover",
//                 "heading": "Value",
//                 "subHead": "(₹ Lakhs)",
//                 "width": "15%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "number"
//             }
//         ],
//         rowData : []
//     })
//     B.render(mae_pricespurts, B.findOne('#ma_equities #mae_pricespurts_table'));
//     loadMAEquities('Price Spurts')
//     activeTabs["priceSpurts"] = true;

// }

// function loadVolumeSpurts(){
//     try{
//         if (activeTabs["loadVolumeSpurts"] && activeTabs["loadVolumeSpurts"] === true) {
//             return;
//           }
//     $('#mae_volumespurts_table', '#tableETFTime').empty();
//     mae_volumespurts = customTable({
//         tableStyle : {id : 'mae_pricespurts_tableC', class :'common_table customHeight-table tableScroll alt_row w-100'},
//         colData : [
//             {
//                 "name": "symbol",
//                 "heading": "Symbol",
//                 "subHead": "",
//                 "width": "25%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false
//             },
//             {
//                 "name": "volume",
//                 "heading": "Volume",
//                 "subHead": "",
//                 "width": "25%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "quantity"
//             },
//             {
//                 "name": "week1AvgVolume",
//                 "heading": "1 WK AVG. VOLUME",
//                 "subHead": "",
//                 "width": "25%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "quantity"
//             },
//             {
//                 "name": "week1volChange",
//                 "heading": "No. of Times",
//                 "subHead": "",
//                 "width": "25%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "quantity"
//             }
//         ],
//         rowData : []
//     })
//      B.render(mae_volumespurts, B.findOne('#mae_volumespurts_table'));
//     B.findOne("#mae_pricespurts_tableC .emptyRow").innerHTML = loader;
//     B.get('/api/live-analysis-volume-gainers?limit=10').then((resp) => {
//         let respJSON = JSON.parse(resp);
//         mae_volumespurts.state.rowData = respJSON.data || [];
//         B.findOne('#tableVolumespurtsTime').innerText = "As on " + respJSON.timestamp + " IST";
//         activeTabs["loadVolumeSpurts"] = true;

//     });
// }catch(e){
//     console.log(e.message)
// }
// }


// function volumeSpurts(){
//     if (activeTabs["volumeSpurts"] && activeTabs["volumeSpurts"] === true) {
//         return;
//       }
//     mae_volumespurts = customTable({
//         tableStyle : {id : 'mae_volumespurts_tableC', class :'common_table customHeight-table tableScroll alt_row w-100'},
//         colData : [
//             {
//                 "name": "symbol",
//                 "heading": "Symbol",
//                 "subHead": "",
//                 "width": "25%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false
//             },
//             {
//                 "name": "volume",
//                 "heading": "Volume",
//                 "subHead": "",
//                 "width": "25%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "quantity"
//             },
//             {
//                 "name": "week1AvgVolume",
//                 "heading": "1 WK AVG. VOLUME",
//                 "subHead": "",
//                 "width": "25%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "quantity"
//             },
//             {
//                 "name": "week1volChange",
//                 "heading": "No. of Times",
//                 "subHead": "",
//                 "width": "25%",
//                 "sort": false,
//                 "chkVal": false,
//                 "chkHigh": false,
//                 "chkLow": false,
//                 "indicator":false,
//                 "sortHighLow":false,
//                 "format" : "quantity"
//             }
//         ],
//         rowData : []
//     })
//     B.render(mae_volumespurts, B.findOne('#ma_equities #mae_volumespurts_table'));
//     loadMAEquities('Volume Spurts')
//     activeTabs["volumeSpurts"] = true;

// }