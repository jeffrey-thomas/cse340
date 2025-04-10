-- Table structure for table 'review'
CREATE TABLE IF NOT EXISTS public.review(
    review_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    account_id integer NOT NULL,
    inv_id integer NOT NULL,
    review_score integer NOT NULL,
    review_text text NOT NULL,
    CONSTRAINT review_pkey PRIMARY KEY (review_id)
);

-- Create relationship between 'review' and 'account' tables
ALTER TABLE IF EXISTS public.review
ADD CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES public.account (account_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION;

-- Create relationship between 'review' and 'inventory' tables
ALTER TABLE IF EXISTS public.review
ADD CONSTRAINT fk_inv FOREIGN KEY (inv_id) REFERENCES public.inventory (inv_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE NO ACTION;
