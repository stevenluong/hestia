module.exports = function(app) {
    var User = app.models.User;
//    var Source = app.models.Source;
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;
/*
    Source.create([
            {name:"JDG",display:true,language:"fr",rss_url:"http://feeds2.feedburner.com/LeJournalduGeek"},
            {name:"Challenges",display:true,language:"fr",rss_url:"http://www.challenges.fr/rss.xml"},
            {name:"LeMonde",display:false,language:"fr",rss_url:"http://rss.lemonde.fr/c/205/f/3050/index.rss"},
            {name:"Korben",display:true,language:"fr",rss_url:"http://feeds2.feedburner.com/KorbensBlog-UpgradeYourMind?format=xml"},
            {name:"BBC",display:false,language:"en",rss_url:"http://feeds.bbci.co.uk/news/rss.xml"},
            {name:"LeParisien",display:false,language:"fr",rss_url:"http://www.leparisien.fr/une/rss.xml"},
            {name:"LePoint",display:false,language:"fr",rss_url:"http://www.lepoint.fr/24h-infos/rss.xml"},
            {name:"LifeHacker",display:true,language:"en",rss_url:"http://lifehacker.com/rss"},
            {name:"The Verge",display:true,language:"en",rss_url:"http://www.theverge.com/rss/frontpage"}
    ]);
    */
    User.create([
            {username: 's', email: 'ste.luong@gmail.com', password: 'test'},
    ], function(err, users) {
        if (err) throw err;

        console.log('Created users:', users);

        //create the admin role
        Role.create({
            name: 'admin'
        }, function(err, role) {
            if (err) throw err;

            console.log('Created role:', role);

            role.principals.create({
                principalType: RoleMapping.USER,
                principalId: users[0].id
            }, function(err, principal) {
                if (err) throw err;

                console.log('Created principal:', principal);
            });
        });
    });
};
