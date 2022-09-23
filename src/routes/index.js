const { Router } = require('express');
const { Op } = require("sequelize");
const Resp =require('../respuesta.json')
// Importar todos los routers;



const router = Router();

router.get("/recipes", async function (req, res) {
    try {
      const { name } = req.query;
  
        const recetas = Resp.results.map((e)=>{
        return {
          id: e.id,
          diets: e.diets,
          name: e.title,
          summary: e.summary,
          points: e.spoonacularScore,
          health: e.healthScore,
          steps: e.analyzedInstructions,
          image: e.image,
        };
      });
  
      let dbIbfo = async () => {
        if (name) {
          return await Recipe.findAll({
            where: {
              name: {
                [Op.like]: `%${name}%`,
              },
            },
            include: {
              model: Diets,
              attributes: ["name"],
              through: { attributes: [] },
            },
          });
        } else {
          return await Recipe.findAll({
            include: {
              model: Diets,
              attributes: ["name"],
              through: { attributes: [] },
            },
          });
        }
      };
  
      let infoDb = await dbIbfo();
  
      const mapeo = infoDb.map((e) => {
        return {
          id: e.id,
          name: e.name,
          steps: e.steps,
          summary: e.summary,
          points: e.points,
          health: e.health,
          dishTypes: el.dishTypes,
          image: e.image,
          createdInDb: e.createdInDb,
          diets: e.diets.map((el) => {
            return el.name;
          }),
        };
      });
  
      const allHere = async () => {
        const infoDeApi = recetas;
        const infoComplete = infoDeApi.concat(mapeo);
        infoComplete
          ? res.json(infoComplete)
          : res
              .status(404)
              .send("the recipe that you are looking for is not here");
      };
      allHere();
    } catch (error) {
      res.status(404).send(error);
    }
  });

  router.get('/recipes/:id', async function (req, res) {
    const { id } = req.params;
  
    try {
      if (id.length < 20) {
        let getApi = Resp
        let infoDeApi = getApi.data;
        let recetas = {
          id: infoDeApi.id,
          diets: infoDeApi.diets,
          name: infoDeApi.name,
          dishTypes: infoDeApi.dishTypes,
          summary: infoDeApi.summary,
          points: infoDeApi.spoonacularScore,
          health: infoDeApi.health,
          steps: infoDeApi.instructions,
          image: infoDeApi.image,
        };
        res.json(recetas);
      } else {
        let infoDb = await Recipe.findOne({
          where: {
            id: id,
          },
          include: {
            model: Diets,
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        });
        let infoenDb = {
          dishTypes: infoDb.dataValues.dishTypes,
          id: infoDb.dataValues.id,
          name: infoDb.dataValues.title,
          steps: infoDb.dataValues.steps,
          dishTypes: infoDb.dataValues.dishTypes,
          summary: infoDb.dataValues.summary,
          points: infoDb.dataValues.points,
          health: infoDb.dataValues.health,
          image: infoDb.dataValues.image,
          createdInDb: infoDb.dataValues.createdInDb,
          diets: infoDb.dataValues.diets.map((el) => {
            return el.name;
          }),
        };
  
        res.json(infoenDb);
      }
    } catch (error) {
      res.status(404).send(error);
    }
  });

  router.get(`/types`, async function (req, res) {
    try {
      const types = await Diets.findAll();
      if (types.length === 0) {
        const types = await Diets.bulkCreate([
          {name: "Gluten Free"},
                {name : "Ketogenic"},
                {name : "Vegetarian"},
                {name : "Lacto-Vegetarian"},
                {name : "Ovo-Vegetarian"},
                {name : "Vegan"},
                {name : "Pescetarian"},
                {name : "Paleo"},
                {name : "Primal"},
                {name : "Low FODMAP"},
                {name : "Whole30"},
        ]);t -
        res.json(types); 
      }
      res.json(types);
    } catch (error) {
      res.status(404).send(error);
    }
  });

  router.post("/recipe", async function (req, res) {
    try {
      const { name, summary, points, health, steps, dishTypes, image, createdInDb, diets } =
        req.body;
  
      let reciCreated = await Recipe.create({
        name,
        summary,
        points,
        dishTypes,
        health,
        steps,
        image,
        createdInDb,
      });
  

      typeDietDb.forEach(async function (t) {
        var temperametBd = await Diets.findOne({
          where:{
            name:  t 
          }
        })
        reciCreated.addDiets(typeDietDb)
    })

    return res.json(reciCreated)

    } catch (error) {
      res.status(404).send(error);
    }
  });

  router.put("/:id", async function (req, res){
    try {
        const { id } = req.params;
        const { 
            name,
            summary,
            points,
            dishTypes,
            health,
            steps,
            image,
        } = req.body;
    
        const recipe = await Recipe.findByPk(id);
        recipe.name = name;
        recipe.summary = summary;
        recipe.points = points;
        recipe.dishTypes = dishTypes;
        recipe.health = health;
        recipe.steps = steps;
        recipe.image = image;

        await recipe.save();
    
        res.json(project);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
  })

  router.delete("/:id", async function (req, res) {
    const { id } = req.params;
    try {
      await Diets.destroy({
        where: {
          recipeId: id,
        },
      });
      await Recipe.destroy({
        where: {
          id,
        },
      });
      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }

  })


  


module.exports = router;
