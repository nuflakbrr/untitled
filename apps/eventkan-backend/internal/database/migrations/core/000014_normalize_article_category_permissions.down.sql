UPDATE permissions SET name = replace(name, 'article.categories.', 'article_categories.')
WHERE name LIKE 'article.categories.%';
