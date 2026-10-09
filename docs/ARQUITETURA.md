# Arquitetura
`HTML/CSS/JS → API REST/Express → Routes → Controllers → Services/Prisma → PostgreSQL 16 (Docker)`

A separação mantém a camada HTTP nos controllers, cálculos no service e persistência no Prisma. O Docker torna o banco reproduzível entre as máquinas da dupla.
