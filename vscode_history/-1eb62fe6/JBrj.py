from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

db = client["gestion_formateurs"]

collection1 = db["formateurs"]
collection2 = db["formations"]


def ajouter():
    formateur = {}
    numero = int(input("entrez votre numero : "))
    nom_formateur = input("entrez votre nom : ")
    prenom_formateur = input("entrez votre prénom : ")
    specialite = input("entrez votre spécialité : ")
    email = input("entrez votre email : ")
    telephone = int(input("entrez votre téléphone : "))

    formateur["numero"] = numero
    formateur["nom_formateur"] = nom_formateur
    formateur["prenom_formateur"] = prenom_formateur
    formateur["specialite"] = specialite
    formateur["email"] = email
    formateur["telephone"] = telephone

    formation = {}
    theme = input("entrez le theme : ")
    cout = input("entrez le cout : ")
    description = input("entrez la description : ")
    duree = int(input("entrez la duree : "))

    formation["theme"] = theme
    formation["cout"] = cout
    formation["description"] = description
    formation["duree"] = duree

    collection1.insert_one(formateur)
    collection2.insert_one(formation)

    print("formateur ajouté avec succès")


n = int(input("entrez le nombre de formateurs a ajouter :"))
for i in range(n):
    print(f"formateur ajouté {i+1} :")
    ajouter()


def afficher(theme):
    print("-----------------------liste des formateurs par theme --------------------")
    for formation in collection2.find({"theme": theme}):
        print(f"le theme : {formation['theme']}")
        print(f"le cout : {formation['cout']}")
        print(f"la description : {formation['description']}")
        print(f"la duree : {formation['duree']}")
    for formateur in collection1.find():
        print(f"le numero : {formateur['numero']}")
        print(f"le nom : {formateur['nom_formateur']}")
        print(f"le prénom : {formateur['prenom_formateur']}")
        print(f"la specialite : {formateur['specialite']}")
        print(f"l'email : {formateur['email']}")
        print(f"le téléphone : {formateur['telephone']}")






def supprimer(numero):
    collection1.delete_one({"numero": numero})
    print("formateur supprimé avec succès")


afficher(input("entrer un theme pour afficher : "))
