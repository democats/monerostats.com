var http_config = {
    headers: {
        'Content-Type': undefined
    },
};
var divider = 0;

var selected_blockchain = {
    "name": "Monero",
    "ticker": "XMR",
    "daemonrpc": "http://blockchain.monerostats.com:6601/",
    "coin_units": 12,
    "difficulty_target": 120
};

var app = angular.module("blockchain", ['angularMoment', 'highcharts-ng']);

app.directive('innerVar', function() {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            var splits = attrs.innerVar.split("=");
            scope.$watch(splits[1], function(val) {
                scope.$eval(attrs.innerVar);
            });
        }
    };
});

app.factory('getInfoFactory', function($http) {
    return {
        info: function(selected_blockchain) {
            var data = JSON.stringify({
                jsonrpc: "2.0",
                id: 0,
                method: "get_info",
                params: {
                }
            });
            return $http.post(selected_blockchain.daemonrpc + "json_rpc", data, http_config);
        }
    }
});

app.factory('poolsFactory', function($rootScope) {
    messages = [];

    var conn = new WebSocket(websocket_pools);
    // called when the server closes the connection
    conn.onclose = function(e) {
        $rootScope.$apply(function() {
            messages.push("DISCONNECTED");
        });
    };
    // called when the connection to the server is made
    conn.onopen = function(e) {
        $rootScope.$apply(function() {
            messages.push("CONNECTED");
        })
    };
    // called when a message is received from the server
    conn.onmessage = function(e) {
        $rootScope.$apply(function() {
            data = JSON.parse(e.data);
            $rootScope.pools = data.pools;
        });
    };
});


app.factory('poolsStatsFactory', function($rootScope) {
    messages = [];

    var conn = new WebSocket(websocket_currencies);
    // called when the server closes the connection
    conn.onclose = function(e) {
        $rootScope.$apply(function() {
            messages.push("DISCONNECTED");
        });
    };
    // called when the connection to the server is made
    conn.onopen = function(e) {
        $rootScope.$apply(function() {
            messages.push("CONNECTED");
        })
    };
    // called when a message is received from the server
    conn.onmessage = function(e) {
        $rootScope.$apply(function() {
            $rootScope.currencies = JSON.parse(e.data);
        });
    };
});

app.controller("MainCtl", ["$scope", "$filter", "$http", "getInfoFactory", function($scope, $filter, $http, getInfoFactory) {
    $scope.cryptonator_data = [];

    $scope.info = getInfoFactory.info(selected_blockchain).success(function(data, status) {
        $scope.info = data.result;
    });

    $scope.getBlocks = function(height) {
        var data = JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "f_blocks_list_json",
            params: {
                height: height
            }
        });

        $http.post(selected_blockchain.daemonrpc + "json_rpc", data, http_config).success(function(data, status) {
            $scope.blocks = data.result.blocks;
        });
    }

    $scope.getCoinmarketcapData = function() {
        $http.get("https://api.coinmarketcap.com/v1/ticker/" + selected_blockchain.name.toLowerCase() + "/").success(function(data, status) {
            $scope.coinmarketcap_data = data;
            console.log(data);
                        console.log(status);
        });
    }

    $scope.$watchCollection('[info]', function() {
        if ($scope.info !== undefined && $scope.info.height !== undefined) {
            $scope.network_hashrate = $scope.info.difficulty / selected_blockchain.difficulty_target
            $scope.getCoinmarketcapData();
            $scope.getBlocks($scope.info.height - 1);
        }
    });
}]);

app.controller("BlocksListCtl", ["$rootScope", "$scope", "$filter", "$http", "getInfoFactory", function($rootScope, $scope, $filter, $http, getInfoFactory) {
    $scope.info = getInfoFactory.info(selected_blockchain).success(function(data, status) {
        $scope.info = data.result;
    });

    $scope.getBlocks = function(height) {
        var data = JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "f_blocks_list_json",
            params: {
                height: height
            }
        });

        $http.post(selected_blockchain.daemonrpc + "json_rpc", data, http_config).success(function(data, status) {
            $scope.blocks = data.result.blocks;
        });
    }

    $scope.changeHeight = function(height) {
        if (height >= $scope.info.height - 1) {
            height = $scope.info.height - 1;
        }
        $scope.height = height;
        $scope.getBlocks($scope.height);
        $scope.prev_block_1 = (height - 61 < 0) ? 0 : height - 61;
        $scope.prev_block_2 = (height - 31 < 0) ? 0 : height - 31;
        $scope.next_block_1 = (height + 1 > $scope.info.height - 1) ? $scope.info.height - 1 : height + 1;
        $scope.next_block_2 = (height + 31 > $scope.info.height - 1) ? $scope.info.height - 1 : height + 31;
    }

    $scope.$watchCollection('[info]', function() {
        if ($scope.info !== undefined && $scope.info.height !== undefined && ($scope.height === undefined || $scope.height === null)) {
            if (urlParam('height'))
                $scope.changeHeight(parseInt(urlParam('height')));
            else
                $scope.changeHeight($scope.info.height - 1);
        }

        if ($scope.height >= $scope.info.height - 1) {
            $scope.changeHeight($scope.info.height - 1);
        }
    });
}]);

app.controller("BlockDetailsCtl", ["$rootScope", "$scope", "$filter", "$http", "getInfoFactory", function($rootScope, $scope, $filter, $http, getInfoFactory) {
    $scope.hash = urlParam('hash');
    $scope.selected_blockchain = selected_blockchain;

    $scope.info = getInfoFactory.info(selected_blockchain).success(function(data, status) {
        $scope.info = data.result;
    });

    $scope.changeBlock = function(hash) {
        $scope.hash = hash;
        $scope.getBlock(hash);
    }

    $scope.getNextHashFromHeight = function(height) {
        var data = JSON.stringify({
            jsonrpc: "2.0",
            id: 0,
            method: "getblockheaderbyheight",
            params: {
                height: (height + 1)
            }
        });

        $http.post(selected_blockchain.daemonrpc + "json_rpc", data, http_config).success(function(data, status) {
            console.log(data);
            $scope.block.next_hash = data.result.block_header.hash;
        });
    }

    $scope.getBlock = function(hash) {
        var data = JSON.stringify({
            jsonrpc: "2.0",
            id: 0,
            method: "f_block_json",
            params: {
                hash: hash
            }
        });

        $http.post(selected_blockchain.daemonrpc + "json_rpc", data, http_config).success(function(data, status) {
            $scope.block = data.result.block;
            if ($scope.block.height != $scope.height)
                $scope.getNextHashFromHeight($scope.block.height);
        });

    }

    $scope.$watchCollection('[info]', function() {
        if ($scope.info !== undefined && $scope.info.height !== undefined && ($scope.height === undefined || $scope.height === null)) {
            $scope.height = $scope.info.height;

            $scope.getBlock($scope.hash);
        }

        if ($scope.height + 2 >= $scope.info.height) {
            $scope.height = $scope.info.height;
        }
    });

}]);


app.controller("TransactionDetailsCtl", ["$rootScope", "$scope", "$filter", "$http", "getInfoFactory", function($rootScope, $scope, $filter, $http, getInfoFactory) {
    $scope.hash = urlParam('hash');
    $scope.selected_blockchain = selected_blockchain;

    $scope.info = getInfoFactory.info(selected_blockchain).success(function(data, status) {
        $scope.info = data.result;
    });

    $scope.getTransaction = function(hash) {
        var data = JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "f_transaction_json",
            params: {
                hash: hash
            }
        });

        $http.post(selected_blockchain.daemonrpc + "json_rpc", data, http_config).success(function(data, status) {
            $scope.transaction = data.result;
        });

    }

    $scope.$watchCollection('[info]', function() {
        if ($scope.info !== undefined && $scope.info.height !== undefined && ($scope.height === undefined || $scope.height === null)) {
            $scope.height = $scope.info.height;
            $scope.getTransaction($scope.hash);
        }
    });
}]);

app.controller("SearchBlockchainCtl", ["$rootScope", "$scope", "$filter", "$http", "$window", function($rootScope, $scope, $filter, $http, $window) {
    $scope.getBlock = function(hash) {
        var data = JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "f_block_json",
            params: {
                hash: hash
            }
        });

        $http.post(selected_blockchain.daemonrpc + "json_rpc", data, http_config).success(function(data, status) {
            if (data.result !== undefined)
                $window.location.href = '/blockchain/block/?hash=' + hash;
        });

    }
    $scope.getTransaction = function(hash) {
        var data = JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "f_transaction_json",
            params: {
                hash: hash
            }
        });

        $http.post($scope.selected_blockchain.daemonrpc + "json_rpc", data, http_config).success(function(data, status) {
            if (data.result !== undefined)
                $window.location.href = '/blockchain/transaction/?hash=' + hash;

        });
    }

    $scope.searchFor = function(search) {
        $scope.getBlock(search);
        $scope.getTransaction(search);
    }
}]);

app.controller("BlockchainChartsCtl", ["$scope", "$filter", "$http", "poolsFactory", "poolsStatsFactory", function($scope, $filter, $http, poolsFactory, poolsStatsFactory) {
    $scope.type = urlParam('type');
    if (!$scope.period)
        $scope.period = '1d';
    $scope.chartsLoaded = false;

    $scope.createChart = function(cf, t) {
        $scope[cf] = {
            options: {
                chart: {
                    zoomType: 'x'
                },
                rangeSelector: {
                    buttons: [{
                        type: 'day',
                        count: 1,
                        text: '1d'
                    }, {
                        type: 'week',
                        count: 1,
                        text: '1w'
                    }, {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6m'
                    }, {
                        type: 'ytd',
                        text: 'YTD'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y'
                    }, {
                        type: 'all',
                        text: 'All'
                    }],
                    selected: 2
                },
                navigator: {
                    enabled: true
                }
            },
            title: {
                text: t
            },
            series: [],
            loading: true,
            useHighStocks: true
        }
    };
    $scope.pushToChart = function(c, ch, p, cf, f, n, vs, vd) {
        var domain = 'https://raw.githubusercontent.com/monerostats/charts/master/';
        $http.get(domain + 'monero/' + ch + '_' + p + '.json')
            .then(function(res) {
                data = res.data;

                $scope[cf].series.push({
                    name: n,
                    data: data.map(window[f], data),
                    tooltip: {
                        valueDecimals: vd,
                        valueSuffix: vs
                    }
                });
                $scope[cf].loading = false;
                $scope.isDisabled = false;
            });
    };
    $scope.clearChart = function(cf) {
        $scope.isDisabled = true;
        $scope[cf].series = [];
        $scope[cf].loading = true;
    };
    $scope.redrawChart = function(cf) {
        $scope[cf].getHighcharts().xAxis[0].setExtremes(new Date(Date.now() + -30 * 24 * 3600 * 1000));
    };

    $scope.reloadChart = function(c, ch, p, cf, f, n, vs, vd) {
        $scope.clearChart(cf);
        $scope.pushToChart(c, ch, p, cf, f, n, vs, vd);
        $scope.redrawChart(cf);
    };

    $scope.$watch('currencies', function() {
        $scope.selected_pool_stats = $filter('getByCurrency')($scope.currencies, 'monero');
        divider = selected_blockchain.coin_units;
        if (!$scope.chartsLoaded) {
            $scope.loadCharts();
            $scope.chartsLoaded = true;
        }
    });

    if ($scope.type == "basic") {
        $scope.loadCharts = function() {
            // Difficulty
            $scope.pushToChart('monero', 'difficulty_avg', $scope.period, 'chartDifficultyConfig', 'toMicrotime', $filter('capitalize')("monero") + ' Difficulty', '', 0);
            $scope.createChart('chartDifficultyConfig', 'Difficulty');

            // Hashrate
            $scope.pushToChart('monero', 'hashrate', $scope.period, 'chartHashrateConfig', 'toMicrotime', $filter('capitalize')("monero") + ' Hashrate', ' H/s', 2);
            $scope.createChart('chartHashrateConfig', 'Hashrate');

            // Generated coins
            $scope.pushToChart('monero', 'generated_coins', $scope.period, 'chartGeneratedCoinsConfig', 'toMicrotimeCoins', $filter('capitalize')("monero") + ' Generated coins', '', 0);
            $scope.createChart('chartGeneratedCoinsConfig', 'Generated coins');

            // Block reward
            $scope.pushToChart('monero', 'block_reward', $scope.period, 'chartBlockRewardConfig', 'toMicrotimeCoins', $filter('capitalize')("monero") + ' Block reward', '', 2);
            $scope.createChart('chartBlockRewardConfig', 'Block reward');

            // Blockchain size
            $scope.pushToChart('monero', 'blockchain_size', $scope.period, 'chartBlockchainSize', 'toMicrotimeMB', $filter('capitalize')("monero") + ' Blockchain size', 'MB', 0);
            $scope.createChart('chartBlockchainSize', 'Blockchain size');
        }
    }

    if ($scope.type == "transactions") {
        $scope.loadCharts = function() {
            // Transactions count all
            $scope.pushToChart('monero', 'transactions_count_all', $scope.period, 'chartTransactionsCountAllConfig', 'toMicrotime', $filter('capitalize')("monero") + ' Transactions count (all)', '', 0);
            $scope.createChart('chartTransactionsCountAllConfig', 'Transactions count (all)');

            // Transactions count
            $scope.pushToChart('monero', 'transactions_count', $scope.period, 'chartTransactionsCountConfig', 'toMicrotime', $filter('capitalize')("monero") + ' Transactions count (per period)', '', 0);
            $scope.createChart('chartTransactionsCountConfig', 'Transactions count (per period)');

            // Transactions fees
            $scope.pushToChart('monero', 'transactions_fees', $scope.period, 'chartTransactionsFeesConfig', 'toMicrotimeCoins', $filter('capitalize')("monero") + ' Transactions fees', '', 2);
            $scope.createChart('chartTransactionsFeesConfig', 'Transactions fees');

            // Transactions outputs
            $scope.pushToChart('monero', 'transactions_outputs', $scope.period, 'chartTransactionsOutputsConfig', 'toMicrotimeCoins', $filter('capitalize')("monero") + ' Transactions outputs (sum)', '', 2);
            $scope.createChart('chartTransactionsOutputsConfig', 'Transactions outputs (sum)');

            // Transactions size
            $scope.pushToChart('monero', 'transactions_size_avg', $scope.period, 'chartTransactionsSizeConfig', 'toMicrotime', $filter('capitalize')("monero") + ' Transactions size (avg)', 'bytes', 0);
            $scope.createChart('chartTransactionsSizeConfig', 'Transactions size (average)');
        }
    }

    if ($scope.type == "blocks") {
        $scope.loadCharts = function() {
            // Blocks size (avg)
            $scope.pushToChart('monero', 'blocks_size_avg', $scope.period, 'chartBlocksSizeConfig', 'toMicrotime', $filter('capitalize')("monero") + ' Blocks size (average)', ' bytes', 0);
            $scope.createChart('chartBlocksSizeConfig', 'Blocks size (average)');

            // Blocks time (avg)
            $scope.pushToChart('monero', 'blocks_time_avg', $scope.period, 'chartBlocksTimeConfig', 'toMicrotime', $filter('capitalize')("monero") + ' Blocks time (average)', ' s', 0);
            $scope.createChart('chartBlocksTimeConfig', 'Blocks time (average)');

            // Current tx median
            $scope.pushToChart('monero', 'block_current_txs_median_max', $scope.period, 'chartBlocksCurrentTxMedianConfig', 'toMicrotime', $filter('capitalize')("monero") + ' Current tx median', ' bytes', 0);
            $scope.createChart('chartBlocksCurrentTxMedianConfig', 'Blocks current tx median (max)');

            // Blocks penalty percentage (avg)
            $scope.pushToChart('monero', 'blocks_penalty_percentage', $scope.period, 'chartBlocksPenaltyPercentageConfig', 'toMicrotime', $filter('capitalize')("monero") + ' Percentage of blocks with penalty', '%', 0);
            $scope.createChart('chartBlocksPenaltyPercentageConfig', 'Percentage of blocks with penalty');
        }
    }
}]);


app.filter('hashrateValue', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return 0;
        if (typeof precision === 'undefined') precision = 2;
        var units = ['H', 'kH', 'MH', 'GH', 'TH', 'PH'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));

        if (units[number] === undefined || units[number] === null) {
            return 0
        }
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision);
    }
});
app.filter('hashrateUnits', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return 'H';
        if (typeof precision === 'undefined') precision = 2;
        var units = ['H', 'kH', 'MH', 'GH', 'TH', 'PH'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));

        if (units[number] === undefined || units[number] === null) {
            return "H"
        }
        return units[number];
    }
});
app.filter('quantityValue', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return 0;
        if (typeof precision === 'undefined') precision = 0;
        var units = ['', 'k', 'M', 'G', 'T', 'P'],
            number = Math.floor(Math.log(bytes) / Math.log(1000));

        if (units[number] === undefined || units[number] === null) {
            return 0
        }
        return (bytes / Math.pow(1000, Math.floor(number))).toFixed(precision);
    }
});
app.filter('quantityUnits', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '';
        if (typeof precision === 'undefined') precision = 0;
        var units = ['', 'k', 'M', 'G', 'T', 'P'],
            number = Math.floor(Math.log(bytes) / Math.log(1000));

        if (units[number] === undefined || units[number] === null) {
            return ""
        }
        return units[number];
    }
});
app.filter('asCoinUnits', function() {
    return function(input, coin_units) {
        return (input / Math.pow(10,coin_units));
    }
});

app.filter('getByCurrency', function() {
    return function(input, currency) {
        var i = 0,
        len = input.length;
        for (; i < len; i++) {
            if (input[i].currency.toUpperCase() === currency.toUpperCase()) {
                return input[i];
            }
        }
        return null;
    }
});
app.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
app.filter('unique', function() {

    return function(items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {},
                newItems = [];

            var extractValueToCompare = function(item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function(item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});
// Fix for moment
app.filter('timeAgo', function() {
    return function(input) {
        return moment(input).fromNow();
    }
});
// End fix


function toMicrotime(data) {
    return [1000 * data[0], data[1]];
}

function toMicrotimeCoins(data) {
    return [1000 * data[0], data[1] / Math.pow(10, divider)];
}

function toMicrotimeMB(data) {
    return [1000 * data[0], data[1] / Math.pow(2, 20)];
}