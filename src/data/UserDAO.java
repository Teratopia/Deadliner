package data;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import entities.Deadline;
import entities.User;

@Transactional
public class UserDAO {

	@PersistenceContext
	EntityManager em;

	@Autowired
	BCryptPasswordEncoder passwordEncoder;

	public User show(int id) {
		User user = em.find(User.class, id);
		return user;
	}

	public User create(User u) {

		// extract raw password
		String rawPassword = u.getPassword();
		// encode raw password
		String encodedPassword = passwordEncoder.encode(rawPassword);
		// reset the user's password to the encoded one
		u.setPassword(encodedPassword);
		// persist the user
		em.persist(u);
		em.flush();

		Deadline d = new Deadline();
		d.setName("Donate to Wikipedia");
		d.setCreateDate(new Date());
		d.setPriority(5);
		d.setUser(u);

		SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd");

		Date t = new Date();
		try {
			t = ft.parse("2017-01-01");
			System.out.println(t);
		} catch (ParseException e) {
			System.out.println("Unparseable using " + ft);
		}
		
		d.setDueDate(t);

		em.persist(d);
		em.flush();

		return u;
	}

	public User verify(String name, String pass) throws NoResultException {
		// sanitize
		String query = "select u from User u where u.name = '" + name + "'";
		List<User> users = em.createQuery(query, User.class).getResultList();

		for (User u : users) {
			if (passwordEncoder.matches(pass, u.getPassword())) {
				return u;
			}
		}
		return null;
	}

	public User update(int id, User u) {
		destroy(id);
		return create(u);
	}

	public void destroy(int id) {
		em.remove(em.find(User.class, id));
	}

	public List<Deadline> showDeadlines(int id) {
		Set<Deadline> dls = em.find(User.class, id).getDeadlines();
		List<Deadline> retDeadlines = new ArrayList<Deadline>();
		for (Deadline d : dls) {
			retDeadlines.add(d);
		}

		return retDeadlines;

	}

	// check
	public Deadline createDeadline(int id, Deadline d) {
		em.persist(d);
		em.flush();

		User u = em.find(User.class, id);
		u.addDeadlines(d);
		em.persist(u);
		em.flush();

		return d;
	}

	public Deadline updateDeadline(int userId, int dlId, Deadline d) {
		destroyDeadline(userId, dlId);
		return createDeadline(userId, d);
	}

	public void destroyDeadline(int userId, int dlId) {
		em.find(User.class, userId).removeDeadline(em.find(Deadline.class, dlId));
		em.remove(em.find(Deadline.class, dlId));
		em.persist(em.find(User.class, userId));
		em.flush();

	}

}
