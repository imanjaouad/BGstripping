from pymongo import MongoClient

Client = MongoClient('mongoddb://localhost:27017/')

db= client["gestion_formateurs"]

collection1 = db["formateurs"]
oollection2= db["formations"]


def ajouter():
    formateur={}
    numero = int(input("entrez votre numero"))
    nom_fomarteur = input("entrez votre nom")
    prenom_formateur = input("entrez votre prénom")
    specialite = input("entrez votre spécialité")
    email = input("entrez votre email")
    telephone = int(input("entrez votre téléphone"))

    formateur["Numero"]=numero
    formateur["Nom_formateur"]=nom_formateur
    formateur["prenom_formateur"]=prenom_formateur
    formateur["specialite"]=specialite
    formateur["email"]=email
    formateur["telephone"]=telephone

    formation={}
    theme=input("entrez le theme")
    cout=input("entrez le cout")
    description=input("entrez la description")
    duree = int(input("entrez la duree"))

    formation["theme"]=theme
    formation["cout"]=cout
    formation["description"]=description
    formation[duree]=duree


    base.insert_one(formateur)
    base.insert_one(formation)

    print("formateur ajouté avec succès")

for i in range(n):
    print(f"formateur ajouté {i+1} :")
    ajouter()

def afficher(theme):
    print("-----------------------liste des formateurs par theme --------------------")
    for formation in base.find({"theme":theme}):
        print(f"le theme : {formation["theme"]}")
        print(f"le cout : {formation["cout"]}")
        print(f"la description : {formation["description"]}")
        print(f"la duree : {formation["duree"]}")



def supprimer(numero):
    collection1.delete_one({"numero":numero})
    print("formateur supprimé avec succès")


afficher()


















