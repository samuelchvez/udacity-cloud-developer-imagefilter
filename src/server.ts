import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8080;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get('/filteredimage',
    async (req: Request, res: Response) => {
      const { image_url = null } = req.query;

      if (image_url) {
        try {
          const filteredImagePath = await filterImageFromURL(image_url);

          res.on('finish', async () => {
            await deleteLocalFiles([filteredImagePath]);
          });

          return res.sendFile(filteredImagePath);
        } catch (error) {
          return res.status(404).send(`An error occurred while loading ${image_url}, please check that it exists and that it\'s public.`);
        }
      }

      return res.status(402).send('Please specify a image_url query param.');
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();