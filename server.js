//import {typeDefs} from "./models/typedefs"

const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer, gql } = require('apollo-server-express');
const Usuario = require('./models/Usuario');
const Medicamento = require('./models/Medicamento');
const Prescripcion = require('./models/Prescripcion');
const cors = require('cors');

let connectionString = 'mongodb+srv://admin:1234@cluster0.uebacdc.mongodb.net/Cesfam';
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
let apolloServer = null;

const typeDefs=gql`
type Medicamento {
    id: ID!
    codigo: String!
    nombre: String!
    laboratorio: String!
    stock: String!
    fecha: String!
    dosis: String!
    unidadMedida: String!
    condiciones: String!
}
    type Query {
        getMedicamentos: [Medicamento]
        getMedicamento(id: ID!): Medicamento
    }
    input Medicamento_Input {
        codigo: String!
        nombre: String!
        laboratorio: String!
        stock: String!
        fecha: String!
        dosis: String!
        unidadMedida: String!
        condiciones: String!
    }
    type Mutation {
        addMedicamento(input: Medicamento_Input): Medicamento
    }
`
const resolvers = {
    Query: {
        async getMedicamentos() {
            const medicamentos = await Medicamento.find();
            return medicamentos;
        },
        async getMedicamento({ id }) {
            const medicamento = await Medicamento.findById(id);
            return medicamento;
        }
    },
    Mutation: {
        async addMedicamento(obj, { input }) {
            const medicamento = new Medicamento(input);
            await medicamento.save();
            return medicamento;
        }//,
        /*async updateMedicamento(obj, {id, input}) {
            const medicamento = Medicamento.findByIdAndUpdate({ id: id, input: input });
            await medicamento.save();
            return medicamento;
        },
        async deleteMedicamento(obj, {id}){
            await medicamento.deleteOne({__id: id});
            return {
                message: 'Usuario Eliminado'
            }    
        }
    },
    Alert: {
*/
    }
}


const corsOptions = {
    origin: "http://localhost:8090",
    credentials: false
}

async function startServer(){
    apolloServer = new ApolloServer({typeDefs, resolvers, corsOptions});
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });
}

startServer();

const app = express();
app.use(cors());
app.listen(8090, function () {
    console.log("Servidor Iniciado");
});