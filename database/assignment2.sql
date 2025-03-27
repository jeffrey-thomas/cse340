-- 1. Insert Tony Stark
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Modify account_type
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- 3. Delete Tony Stark
DELETE FROM public.account WHERE account_id = 1;

--4. Update Hummer
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

--5. Get 'sport' vehicles
SELECT inv_make, inv_model
FROM public.inventory
INNER JOIN public.classification
ON public.inventory.classification_id = public.classification.classification_id
WHERE classification_name = 'Sport';

--6. Add '/vehicles' to image paths
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/','/images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail,'/images/','/images/vehicles/');