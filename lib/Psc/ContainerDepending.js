define(['jquery', 'joose', 'Psc/Container'], function ($, Joose) {
  /**
   * ContainerInjecting: the interface for injecting a container to other classes (creating one)
   * ContainerDepending: the interface for wanting a container
   */
  Joose.Class('Psc.ContainerDepending', {

    has: {
      container: { is: 'rw', required: true, isPrivate: true}
    }
    
  });
});