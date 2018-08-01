//prod
//var serverSocket = "slapps.fr:3030";
//dev
//var serverSocket = "localhost:3030";
'use strict';

/* Controllers */

var mainControllers = angular.module('mainControllers', []);
mainControllers.controller('MainCtrl', ['$scope','Rates','Simulation',
        function($scope, Rates,Simulation) {
            $scope.simulations= [];
            $scope.simulation= {};
            // CHART
            //$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
            $scope.series = ['25 ans','20 ans','15 ans','12 ans','10 ans', '7 ans'];
            $scope.labels = [];
            $scope.data = [[],[],[],[],[],[]];
            $scope.todayRate = [];
            $scope.datasetOverride = [{ fill : false },{ fill : false },{ fill : false },{ fill : false },{ fill : false },{ fill : false }];
            Rates.getRates().success(function(response){
                response.forEach(function(rate){
                    if(rate.years==25){
                        $scope.labels.push(rate.date);
                        $scope.data[0].push(rate.rate);
                        $scope.todayRate[0]=rate.rate;
                    }
                    if(rate.years==20){
                        $scope.data[1].push(rate.rate);
                        $scope.todayRate[1]=rate.rate;
                    }

                    if(rate.years==15){
                        $scope.data[2].push(rate.rate);
                        $scope.todayRate[2]=rate.rate;
                    }

                    if(rate.years==12){
                        $scope.data[3].push(rate.rate);
                        $scope.todayRate[3]=rate.rate;
                    }

                    if(rate.years==10){
                        $scope.data[4].push(rate.rate);
                        $scope.todayRate[4]=rate.rate;
                    }
                    if(rate.years==7){
                        $scope.data[5].push(rate.rate);
                        $scope.todayRate[5]=rate.rate;
                    }

                })
                //var size = $scope.data[0].length;
                //console.log($scope.data[5][size-1])
            });
            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };
            //Default values
            //$scope.defaultTotalValue = 223100;
            //$scope.defaultInsuranceRate = 0.22;
            //$scope.defaultRate = 2.15;
            //$scope.defaultYears = 25;
            $scope.defaultTotalValue = 279712.21;
            $scope.defaultInsuranceRate = 0.39;
            $scope.defaultRate = 1.75;
            $scope.defaultYears = 25;

            //$scope.simulation.loanCost = 0;
            //$scope.simulation.insuranceCost = 0;
            //$scope.simulation.totalCost = 0;

            //$scope.simulation.monthlyRent= 0;
            //$scope.simulation.monthlyInsurance = 0;
            //$scope.simulation.monthlyTotalRent= 0;

            //$scope.simulation.monthlyCost = 0;
            //$scope.simulation.monthlyTotalCost = 0;

            //$scope.simulation.costRate = 0;
            //$scope.simulation.totalRate = 0;

            var preCheck=function(){
                if($scope.simulation.insuranceRate==null)
                    $scope.simulation.insuranceRate= $scope.defaultInsuranceRate;
                if($scope.simulation.totalValue==null)
                    $scope.simulation.totalValue = $scope.defaultTotalValue;
                //Rate processing
                var rate = $scope.simulation.rate;
                if(rate==null)
                    rate = $scope.defaultRate;
                if(isNaN(rate)){
                    rate = rate.replace(",",".");
                }
                $scope.simulation.rate = rate;
                if($scope.simulation.years==null)
                    $scope.simulation.years= $scope.defaultYears;
            }
            var processLoanCost=function(monthlyRent,totalValue,months){
                return parseInt(monthlyRent*months-totalValue);
            };
            var processMonthlyRent=function(rate,totalValue,monthlyRate,months){
                var monthlyRent=0;
                if(rate!=0)
                    monthlyRent=parseInt((totalValue*monthlyRate)/(1-Math.pow(1+monthlyRate,-months)));
                else
                    monthlyRent=parseInt(totalValue/months);
                return monthlyRent; 
            };
            var processMonthlyInsurance=function(insuranceRate,totalValue){
                return parseInt(totalValue*insuranceRate/100/12);
            };
            var addSimulation=function(s){
                $scope.simulations.push(s)
            }
            var traceSimulation = function(s){
                var simulation = new Simulation(s);
                Simulation.save(simulation);
            }
            var isValid = function(simulation){
                if(isNaN(simulation.totalCost)){
                    console.log("NAN");
                    return false;
                }
                return true;
            }
            $scope.clickSimulate=function(){
                var s = simulate();
                if(isValid(s)){
                    addSimulation(s);
                    traceSimulation(s);
                }
            }
            var simulate=function(){
                preCheck();
                var totalValue = $scope.simulation.totalValue;
                var insuranceRate= $scope.simulation.insuranceRate;
                var rate = $scope.simulation.rate;
                var monthlyRate = rate/12/100;
                var months = $scope.simulation.years*12;
                //MonthlyRent
                var monthlyRent = processMonthlyRent(rate,totalValue,monthlyRate,months);
                $scope.simulation.monthlyRent=monthlyRent;
                var monthlyInsurance = processMonthlyInsurance(insuranceRate,totalValue);
                $scope.simulation.monthlyInsurance = monthlyInsurance;
                $scope.simulation.monthlyTotalRent = monthlyRent+monthlyInsurance;
                //LoanCost
                var loanCost = processLoanCost(monthlyRent,totalValue,months);
                $scope.simulation.loanCost=loanCost;
                var insuranceCost = monthlyInsurance*months;
                $scope.simulation.insuranceCost= insuranceCost;
                var totalCost = loanCost+insuranceCost;
                $scope.simulation.totalCost = totalCost; 
                //monthlyCost
                /*
                   var monthlyCost = parseInt(loanCost/months);
                   $scope.simulation.monthlyCost= monthlyCost;
                   $scope.simulation.monthlyTotalCost = monthlyCost+monthlyInsurance;
                   */
                //CostRate
                $scope.simulation.costRatio=parseInt(loanCost/totalValue*100);
                $scope.simulation.insuranceRatio =parseInt(insuranceCost/totalValue*100);
                $scope.simulation.totalRatio =parseInt(totalCost/totalValue*100);
                return {
                    //TODO update
                    at: new Date(),
                    totalValue: $scope.simulation.totalValue,
                    rate: $scope.simulation.rate,
                    insuranceRate: $scope.simulation.insuranceRate,
                    years: $scope.simulation.years,
                    loanCost: $scope.simulation.loanCost,
                    insuranceCost: $scope.simulation.insuranceCost,
                    totalCost: $scope.simulation.totalCost,
                    monthlyRent: $scope.simulation.monthlyRent,
                    monthlyInsurance: $scope.simulation.monthlyInsurance,
                    monthlyTotalRent: $scope.simulation.monthlyTotalRent,
                    //monthlytotalCost: $scope.simulation.monthlyTotalCost,
                    costRatio: $scope.simulation.costRatio,
                    totalRatio: $scope.simulation.totalRatio,
                    //ROR
                    costRate: $scope.simulation.costRatio,
                    monthlyCost:$scope.simulation.monthlyRent
                        //monthlytotalCost:$scope.simulation.monthlyRent,
                };
            };
            var s = simulate();
            addSimulation(s);
        }]);

