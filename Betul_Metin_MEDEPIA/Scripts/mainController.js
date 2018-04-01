application.controller('mainController', function ($scope, $http, $timeout, $alert) {

    $scope.init = function () {
        $scope.data = {
            week1: [],
            week2: [],
            week3: [],
            week4: [],
            week5: [],
            week6: [],
            week7: [],
            week8: [],
            week9: [],
            week10: [],
        };

        //Parametrelere default değerlerin girilmesi
        $scope.currentWeek = 1;
        $scope.thisWeek = "week" + $scope.currentWeek;
        $scope.totalWeek = 10;
        $scope.disabledNextButton = true;
        $scope.disabledFirstButton = false;
        $scope.isPlayingAll = false;  

        //Json dosyasından verilerin çekilmesi
        $http.get('league.json').then(function (response) {

            //Lig bilgileri
            $scope.leagueStageInfos = {
                tournamentName: response.data.leagueStage[0].tournamentName,
                logo: response.data.leagueStage[0].logo
            };

            var teamInfos = response.data.leagueStage[0].leagueTable;

            //Lig tablosu için gereken bilgilerin tutulması
            $scope.ligStatus = [];
            angular.forEach(teamInfos, function (team) {
                $scope.ligStatus.push(
                    {
                        teamId: team.teamId,
                        teamLogo: team.teamLogo,
                        teamName: team.name,
                        winCount: 0,
                        defeatCount: 0,
                        tieCount: 0,
                        scoredGoal: 0,
                        loserGoal: 0,
                        average: 0,
                        result: 0
                    });
            });

            //Haftalık fikstürler belirlendi
            $scope.data.week1.push({ team1: teamInfos[0], team2: teamInfos[1] });
            $scope.data.week1.push({ team1: teamInfos[2], team2: teamInfos[3] });
            $scope.data.week1.push({ team1: teamInfos[4], team2: teamInfos[5] });

            $scope.data.week2.push({ team1: teamInfos[0], team2: teamInfos[3] });
            $scope.data.week2.push({ team1: teamInfos[1], team2: teamInfos[5] });
            $scope.data.week2.push({ team1: teamInfos[2], team2: teamInfos[4] });

            $scope.data.week3.push({ team1: teamInfos[0], team2: teamInfos[5] });
            $scope.data.week3.push({ team1: teamInfos[3], team2: teamInfos[4] });
            $scope.data.week3.push({ team1: teamInfos[1], team2: teamInfos[2] });

            $scope.data.week4.push({ team1: teamInfos[0], team2: teamInfos[4] });
            $scope.data.week4.push({ team1: teamInfos[5], team2: teamInfos[2] });
            $scope.data.week4.push({ team1: teamInfos[3], team2: teamInfos[1] });

            $scope.data.week5.push({ team1: teamInfos[0], team2: teamInfos[2] });
            $scope.data.week5.push({ team1: teamInfos[4], team2: teamInfos[1] });
            $scope.data.week5.push({ team1: teamInfos[5], team2: teamInfos[3] });

            $scope.data.week6.push({ team2: teamInfos[0], team1: teamInfos[1] });
            $scope.data.week6.push({ team2: teamInfos[2], team1: teamInfos[3] });
            $scope.data.week6.push({ team2: teamInfos[4], team1: teamInfos[5] });

            $scope.data.week7.push({ team2: teamInfos[0], team1: teamInfos[3] });
            $scope.data.week7.push({ team2: teamInfos[1], team1: teamInfos[5] });
            $scope.data.week7.push({ team2: teamInfos[2], team1: teamInfos[4] });

            $scope.data.week8.push({ team2: teamInfos[0], team1: teamInfos[5] });
            $scope.data.week8.push({ team2: teamInfos[3], team1: teamInfos[4] });
            $scope.data.week8.push({ team2: teamInfos[1], team1: teamInfos[2] });

            $scope.data.week9.push({ team2: teamInfos[0], team1: teamInfos[4] });
            $scope.data.week9.push({ team2: teamInfos[5], team1: teamInfos[2] });
            $scope.data.week9.push({ team2: teamInfos[3], team1: teamInfos[1] });

            $scope.data.week10.push({ team2: teamInfos[0], team1: teamInfos[2] });
            $scope.data.week10.push({ team2: teamInfos[4], team1: teamInfos[1] });
            $scope.data.week10.push({ team2: teamInfos[5], team1: teamInfos[3] });
        });
    };

    //Bu Haftayı Oynat butonu için yazılan fonksiyon
    $scope.playThisWeek = function () {
        $scope.scoreCalculation($scope.thisWeek);
        $scope.disabledFirstButton = true;
        $scope.disabledNextButton = false;

        if ($scope.currentWeek >= $scope.totalWeek || $scope.isPlayingAll == true) {
            $scope.disabledNextButton = true;
        }
    };

    //Sonraki Hafta butonu için yazılan fonksiyon
    $scope.playNextWeek = function () {
        $scope.currentWeek = $scope.currentWeek + 1;
        $scope.thisWeek = "week" + $scope.currentWeek;

        $scope.scoreCalculation($scope.thisWeek);

        if ($scope.currentWeek >= $scope.totalWeek) {
            $scope.disabledNextButton = true;
        }
    };

    //Sonraki Tüm Haftaların Oynatılması için yazılan fonksiyon
    $scope.playAllWeeks = function () {
        $scope.isPlayingAll = true;
        for (var i = $scope.currentWeek; i <= $scope.totalWeek; i++) {
            $timeout(function () {
                $scope.playThisWeek();
            }, i * 1000);

            $timeout(function () {
                $scope.currentWeek += 1;
            }, (i + 1) * 1000);
        }
    };

    //Yeniden başlatma fonksiyonu
    $scope.reStart = function () {
        $alert.areYouSure(function () {
            $scope.init();
        });
    };

    //Skorun hesaplanması
    $scope.scoreCalculation = function (thisWeek) {

        angular.forEach($scope.data[thisWeek], function (match) {

            var chance = Math.floor(Math.random() * 100); //0 ile 100 arasından rastgele ihtimal belirlenir
            var score1 = Math.floor(Math.random() * 2);  //Skor için küçük değer
            var score2 = Math.floor(Math.random() * 3) + 3; //Skor için büyük değer

            //1. Takım güçlü ise
            if (match.team1.overall > match.team2.overall) {
                //Güçlü takımın kazanma ihtimali
                if (chance >= 50) {
                    match.score = score2 + " - " + score1;
                    $scope.setScore(match.team1, match.team2, score1, score2);
                }
                //Berabere kalma ihtimali
                if (chance >= 20 && chance < 50) {
                    match.score = score1 + " - " + score1;
                    $scope.setTieScore(match.team1, match.team2, score1);
                }
                //Güçlü takımın kaybetme ihtimali
                if (chance < 20) {
                    match.score = score1 + " - " + score2;
                    $scope.setScore(match.team2, match.team1, score1, score2);
                }
            }

            //2. Takım güçlü ise
            if (match.team1.overall < match.team2.overall) {
                //Güçlü takımın kazanma ihtimali
                if (chance >= 50) {
                    match.score = score1 + " - " + score2;
                    $scope.setScore(match.team2, match.team1, score1, score2);
                }
                //Berabere kalma ihtimali
                if (chance >= 20 && chance < 50) {
                    match.score = score1 + " - " + score1;
                    $scope.setTieScore(match.team1, match.team2, score1);
                }
                //Güçlü takımın kaybetme ihtimali
                if (chance < 20) {
                    match.score = score2 + " - " + score1;
                    $scope.setScore(match.team2, match.team1, score2, score1);
                }
            }
        });
    };

    $scope.setScore = function (team1, team2, score1, score2) {
        angular.forEach($scope.ligStatus, function (item) {
            if (item.teamId === team1.teamId) {
                item.result += 3;
                item.scoredGoal += score2;
                item.loserGoal += score1;
                item.average = (item.scoredGoal - item.loserGoal);
                item.winCount += 1;
            }
            if (item.teamId === team2.teamId) {
                item.scoredGoal += score1;
                item.loserGoal += score2;
                item.average = (item.scoredGoal - item.loserGoal);
                item.defeatCount += 1;
            }
        });
    }

    $scope.setTieScore = function (team1, team2, score) {
        angular.forEach($scope.ligStatus, function (item) {
            if (item.teamId === team1.teamId) {
                item.result += 1;
                item.scoredGoal += score;
                item.loserGoal += score;
                item.average += 0;
                item.tieCount += 1;
            }
            if (item.teamId === team2.teamId) {
                item.result += 1;
                item.scoredGoal += score;
                item.loserGoal += score;
                item.average += 0;
                item.tieCount += 1;
            }
        });
    }

    $scope.init();

});