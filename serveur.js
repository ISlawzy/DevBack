const express = require('express');
const { MongoClient } = require('mongodb');
const bodyparseur = require('body-parser')

const uri = "mongodb+srv://islawzylll:test@myserver.wyxcead.mongodb.net/?retryWrites=true&w=majority"

const app = express();
app.use(bodyparseur.json())
const port = 3000;


app.use((req, res, next)=>{
    console.log(`Requete recu: ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    next();
})



const client = new MongoClient(uri);
    client.connect(err =>{
    if(err){
        console.log("Erreur a la connexion a la base de donnée")
    } else {
        console.log("connexion reussie");
    }
});

app.post('/Utilisateurs', (request, response) => {
    const {nom, prenom} = request.body

    if(!nom || !prenom){
        return response.status(400).json({ erreur : "Veuillez fournir un nom ou un prenom"})
    }

    const nouvelUtilisateur = {nom, prenom};
    const collection = client.db("MyDb").collection("Utilisateurs");

    try{
        const result = collection.insertOne(nouvelUtilisateur);
        console.log("utilisiteur ajouter avec succes");
        response.status(201).json(nouvelUtilisateur);
    }
    catch (error){
        console.error("erreur lors de l'ajout de l'utilisateur", error)
        response.status(500).json({erreur : "erreur lors de l'ajout de l'utilisateur"})
    }

});

app.delete('/Utilisateurs',(request, response)=>{

})

app.get('/Utilisateurs', (request, response)=>{
    const collection = client.db("MyDb").collection("Utilisateurs");
    collection.find().toArray((err, Utilisateurs)=>{
        if(err) {
            console.error('erreur lors de la recherche des utilisateurs', error);
            response.status(500).send("erreur interne du serveur")
        } else{
            response.json(Utilisateurs);
        }
    });
});
    
app.listen(port, ()=>{
    console.log(`serveur en cours d'execution sur le port : ${port}`)
})