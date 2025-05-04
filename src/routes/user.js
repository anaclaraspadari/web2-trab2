const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/database');
const { requireLogin, requireAdmin } = require('../middlewares/authMiddleware');


// Rota de formulário
router.get('/addUser', (req, res) => {
    res.render('addUser', { error: null });
});

// Rota de cadastro
router.post('/addUser', async (req, res) => {
    const { nome, cpf, senha } = req.body;

    try {
        db.get("SELECT * FROM usuarios WHERE cpf = ?", [cpf], async (err, row) => {
            if (row) {
                return res.render('addUser', { error: "CPF já cadastrado!" });
            }

            const hash = await bcrypt.hash(senha, 10);

            // Verificar se há algum usuário
            db.get("SELECT COUNT(*) AS total FROM usuarios", (err, result) => {
                const perfil = result.total === 0 ? 'ADMIN' : 'CLIENTE';

                db.run("INSERT INTO usuarios (nome, cpf, senha, perfil) VALUES (?, ?, ?, ?)",
                    [nome, cpf, hash, perfil],
                    (err) => {
                        if (err) {
                            console.error(err);
                            return res.render('addUser', { error: "Erro ao cadastrar." });
                        }
                        res.redirect('/login');
                    }
                );
            });
        });
    } catch (err) {
        console.error(err);
        res.render('addUser', { error: "Erro interno no servidor." });
    }
});

router.get('/users', (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const page = parseInt(req.query.pagina) || 1;
    const filtro = req.query.filtro || "";
    const limit = 5;
    const offset = (page - 1) * limit;

    const filtroQuery = `%${filtro}%`;

    const query = `
        SELECT * FROM usuarios
        WHERE nome LIKE ?
        ORDER BY nome ASC
        LIMIT ? OFFSET ?
    `;

    db.all(query, [filtroQuery, limit, offset], (err, rows) => {
        if (err) return res.send("Erro ao buscar usuários.");

        db.get(`SELECT COUNT(*) AS total FROM usuarios WHERE nome LIKE ?`, [filtroQuery], (err, result) => {
            const total = result.total;
            const hasMore = offset + limit < total;

            res.render('users', {
                users: rows,
                page,
                filtro,
                hasMore,
                sessionUser: req.session.user
            });
        });
    });
});

// Rota /user/:id - Detalhes do usuário
router.get('/user/:id', (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const userId = req.params.id;

    db.get('SELECT * FROM usuarios WHERE id = ?', [userId], (err, usuario) => {
        if (err || !usuario) return res.send('Usuário não encontrado.');

        db.all('SELECT * FROM telefones WHERE usuario_id = ?', [userId], (err, telefones) => {
            if (err) return res.send('Erro ao buscar telefones.');

            db.all('SELECT * FROM emails WHERE usuario_id = ?', [userId], (err, emails) => {
                if (err) return res.send('Erro ao buscar emails.');

                res.render('userDetails', {
                    usuario,
                    telefones,
                    emails,
                    sessionUser: req.session.user
                });
            });
        });
    });
});

// Rota /users - Listagem
router.get('/users', (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const filtro = req.query.filtro || '';

    db.all(
        'SELECT * FROM usuarios WHERE nome LIKE ? LIMIT ? OFFSET ?',
        [`%${filtro}%`, limit, offset],
        (err, usuarios) => {
            if (err) return res.send('Erro ao buscar usuários.');

            db.get('SELECT COUNT(*) AS total FROM usuarios WHERE nome LIKE ?', [`%${filtro}%`], (err, result) => {
                if (err) return res.send('Erro na contagem.');
                const total = result.total;
                const totalPages = Math.ceil(total / limit);
                res.render('userList', { usuarios, filtro, page, totalPages, sessionUser: req.session.user });
            });
        }
    );
});

// Rota /user/:id - Detalhes do usuário
router.get('/user/:id', (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const userId = req.params.id;

    db.get('SELECT * FROM usuarios WHERE id = ?', [userId], (err, usuario) => {
        if (err || !usuario) return res.send('Usuário não encontrado.');

        db.all('SELECT * FROM telefones WHERE usuario_id = ?', [userId], (err, telefones) => {
            if (err) return res.send('Erro ao buscar telefones.');

            db.all('SELECT * FROM emails WHERE usuario_id = ?', [userId], (err, emails) => {
                if (err) return res.send('Erro ao buscar emails.');

                res.render('userDetails', {
                    usuario,
                    telefones,
                    emails,
                    sessionUser: req.session.user
                });
            });
        });
    });
});

// Rota /updateUser/:id - Formulário de edição
router.get('/updateUser/:id', (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const id = parseInt(req.params.id);
    const sessionUser = req.session.user;

    const requireAdmin = sessionUser.perfil === 'ADMIN';
    const isSelf = sessionUser.id === id;

    if (!requireAdmin && !isSelf) return res.status(403).send('Acesso negado.');

    db.get('SELECT * FROM usuarios WHERE id = ?', [id], (err, usuario) => {
        if (err || !usuario) return res.send('Usuário não encontrado.');

        db.all('SELECT * FROM telefones WHERE usuario_id = ?', [id], (err, telefones) => {
            if (err) return res.send('Erro ao buscar telefones.');

            db.all('SELECT * FROM emails WHERE usuario_id = ?', [id], (err, emails) => {
                if (err) return res.send('Erro ao buscar emails.');

                res.render('userEdit', {
                    usuario,
                    telefones,
                    emails,
                    sessionUser
                });
            });
        });
    });
});

// Middleware para verificar permissões de edição
function canEditUser(req, res, next) {
    const requireAdmin = req.session.user.perfil === 'ADMIN';
    const isSelf = parseInt(req.params.id) === req.session.user.id;
    if (requireAdmin || isSelf) {
      return next();
    }
    return res.status(403).send('Acesso negado.');
  }
  
  // GET /updateUser/:id
  router.get('/updateUser/:id', requireLogin, canEditUser, (req, res) => {
    const userId = req.params.id;
    db.get(`SELECT * FROM usuarios WHERE id = ?`, [userId], (err, user) => {
      if (err || !user) return res.status(404).send('Usuário não encontrado.');
  
      db.all(`SELECT * FROM telefones WHERE usuario_id = ?`, [userId], (err, telefones) => {
        if (err) telefones = [];
        db.all(`SELECT * FROM emails WHERE usuario_id = ?`, [userId], (err, emails) => {
          if (err) emails = [];
          res.render('editUser', { user, telefones, emails });
        });
      });
    });
  });
  
  // POST /updateUser/:id
  router.post('/updateUser/:id', requireLogin, canEditUser, (req, res) => {
    const userId = req.params.id;
    const { nome, senha, telefones = [], emails = [] } = req.body;
  
    // Atualiza nome e senha (se fornecida)
    const updateUser = () => {
      if (senha) {
        bcrypt.hash(senha, 10, (err, hash) => {
          if (err) return res.status(500).send('Erro ao salvar senha');
          db.run(`UPDATE usuarios SET nome = ?, senha = ? WHERE id = ?`, [nome, hash, userId], updateContacts);
        });
      } else {
        db.run(`UPDATE usuarios SET nome = ? WHERE id = ?`, [nome, userId], updateContacts);
      }
    };
  
    // Atualiza telefones e emails (apaga todos e insere novamente — simplificação)
    const updateContacts = () => {
      db.serialize(() => {
        db.run(`DELETE FROM telefones WHERE usuario_id = ?`, [userId]);
        telefones.forEach(tel => {
          db.run(`INSERT INTO telefones (usuario_id, numero, principal) VALUES (?, ?, ?)`,
            [userId, tel.numero, tel.principal === 'on' ? 1 : 0]);
        });
  
        db.run(`DELETE FROM emails WHERE usuario_id = ?`, [userId]);
        emails.forEach(email => {
          db.run(`INSERT INTO emails (usuario_id, email, principal) VALUES (?, ?, ?)`,
            [userId, email.email, email.principal === 'on' ? 1 : 0]);
        });
  
        res.redirect(`/user/${userId}`);
      });
    };
  
    updateUser();
  });

  router.post('/deleteUser/:id', requireLogin, requireAdmin, async (req, res) => {
    const userId = parseInt(req.params.id);
    const loggedUserId = req.session.userId;
  
    try {
      const db = await openDb();
  
      // Verifica se o usuário a ser deletado existe
      const targetUser = await db.get(`SELECT * FROM usuarios WHERE id = ?`, [userId]);
      if (!targetUser) {
        return res.status(404).send('Usuário não encontrado.');
      }
  
      // Impede que um ADMIN exclua outro ADMIN (exceto a si mesmo)
      if (targetUser.perfil === 'ADMIN' && userId !== loggedUserId) {
        return res.status(403).send('Você não pode excluir outro ADMIN.');
      }
  
      // Exclui dependências (telefones/emails) e depois o usuário
      await db.run(`DELETE FROM telefones WHERE usuario_id = ?`, [userId]);
      await db.run(`DELETE FROM emails WHERE usuario_id = ?`, [userId]);
      await db.run(`DELETE FROM usuarios WHERE id = ?`, [userId]);
  
      // Se ele se excluiu, encerra a sessão
      if (userId === loggedUserId) {
        req.session.destroy(() => {
          res.redirect('/login');
        });
      } else {
        res.redirect('/users');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao excluir usuário.');
    }
  });
  

module.exports = router;
